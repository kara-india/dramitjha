/**
 * KrishnaHealth ERP — Server Actions: Inventory & Pharmacy
 * Dr. Amit Jha Sports Injury Clinic, Varanasi
 *
 * Implements FEFO (First-Expiry First-Out) dispensing with SELECT FOR UPDATE
 * to prevent race conditions during concurrent pharmacy operations.
 * Tracks consignment implants separately from regular inventory.
 */
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/(auth)/login/actions";
import { generateDocumentNumber } from "@/lib/utils";
import { z } from "zod";
import type { InventoryItemType, MovementType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/app/(auth)/login/actions";

// ============================================================
// SCHEMAS
// ============================================================

const addInventoryItemSchema = z.object({
  itemCode: z.string().min(1, "Item code is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  genericName: z.string().optional(),
  category: z.string().optional(),
  itemType: z.enum([
    "MEDICINE",
    "CONSUMABLE",
    "IMPLANT",
    "CONSIGNMENT_IMPLANT",
    "VACCINE",
    "EQUIPMENT",
    "SURGICAL_SUPPLY",
  ]),
  unit: z.string().default("tablets"),
  packSize: z.number().int().positive().default(1),
  mrp: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  hsnCode: z.string().optional(),
  gstPercent: z.number().min(0).max(28).default(0),
  reorderLevel: z.number().int().nonnegative().default(10),
  reorderQty: z.number().int().nonnegative().default(50),
  requiresPrescription: z.boolean().default(false),
  isNarcotic: z.boolean().default(false),
  requiresColdChain: z.boolean().default(false),
  isConsignment: z.boolean().default(false),
  supplierId: z.string().optional().nullable(),
});

const receiveBatchSchema = z.object({
  inventoryItemId: z.string().min(1),
  batchNumber: z.string().min(1, "Batch number is required"),
  manufacturingDate: z.string().optional().nullable(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  receivedQty: z.number().int().positive(),
  costPerUnit: z.number().nonnegative(),
  mrpPerUnit: z.number().nonnegative(),
  purchaseOrderId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
});

const dispenseSchema = z.object({
  items: z.array(
    z.object({
      inventoryItemId: z.string().min(1),
      quantity: z.number().int().positive(),
      prescriptionItemId: z.string().optional().nullable(),
    })
  ),
  referenceType: z.enum(["PRESCRIPTION", "INVOICE", "ADJUSTMENT"]),
  referenceId: z.string().optional().nullable(),
  notes: z.string().optional(),
});

// ============================================================
// CREATE INVENTORY ITEM
// ============================================================

export async function createInventoryItem(
  input: z.infer<typeof addInventoryItemSchema>
): Promise<ActionResult<{ id: string; itemCode: string }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const parsed = addInventoryItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Validation error",
      code: "VALIDATION_ERROR",
    };
  }

  // Check duplicate item code
  const existing = await prisma.inventoryItem.findUnique({
    where: {
      tenantId_itemCode: {
        tenantId: user.tenantId,
        itemCode: parsed.data.itemCode,
      },
    },
  });

  if (existing) {
    return {
      success: false,
      error: `Item code '${parsed.data.itemCode}' already exists.`,
      code: "DUPLICATE_CODE",
    };
  }

  try {
    const item = await prisma.inventoryItem.create({
      data: {
        tenantId: user.tenantId,
        ...parsed.data,
        itemType: parsed.data.itemType as InventoryItemType,
        isConsignment:
          parsed.data.isConsignment ||
          parsed.data.itemType === "CONSIGNMENT_IMPLANT",
        costPrice: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: "CREATE",
        tableName: "inventory_items",
        recordId: item.id,
        newData: { itemCode: item.itemCode, name: item.name },
      },
    });

    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      data: { id: item.id, itemCode: item.itemCode },
    };
  } catch (error) {
    console.error("createInventoryItem error:", error);
    return {
      success: false,
      error: "Failed to create inventory item.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// RECEIVE BATCH (Purchase Receipt / GRN)
// ============================================================

export async function receiveBatch(
  input: z.infer<typeof receiveBatchSchema>
): Promise<ActionResult<{ batchId: string; newTotalQty: number }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const parsed = receiveBatchSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Validation error",
      code: "VALIDATION_ERROR",
    };
  }

  const data = parsed.data;

  // Validate item exists and belongs to tenant
  const item = await prisma.inventoryItem.findFirst({
    where: { id: data.inventoryItemId, tenantId: user.tenantId, deletedAt: null },
  });

  if (!item) {
    return { success: false, error: "Inventory item not found", code: "NOT_FOUND" };
  }

  // Check for duplicate batch number for same item
  const existingBatch = await prisma.inventoryBatch.findFirst({
    where: {
      inventoryItemId: data.inventoryItemId,
      batchNumber: data.batchNumber,
      deletedAt: null,
    },
  });

  if (existingBatch) {
    return {
      success: false,
      error: `Batch ${data.batchNumber} already exists for this item.`,
      code: "DUPLICATE_BATCH",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create batch
      const batch = await tx.inventoryBatch.create({
        data: {
          inventoryItemId: data.inventoryItemId,
          batchNumber: data.batchNumber,
          manufacturingDate: data.manufacturingDate
            ? new Date(data.manufacturingDate)
            : null,
          expiryDate: new Date(data.expiryDate),
          receivedQty: data.receivedQty,
          availableQty: data.receivedQty,
          costPerUnit: data.costPerUnit,
          mrpPerUnit: data.mrpPerUnit,
          supplierId: data.supplierId ?? null,
          purchaseOrderId: data.purchaseOrderId ?? null,
        },
      });

      // Update item total quantity
      const updatedItem = await tx.inventoryItem.update({
        where: { id: data.inventoryItemId },
        data: {
          totalQuantity: { increment: data.receivedQty },
          costPrice: data.costPerUnit, // Update to latest cost
        },
      });

      // Record stock movement
      await tx.stockMovement.create({
        data: {
          tenantId: user.tenantId,
          inventoryItemId: data.inventoryItemId,
          batchId: batch.id,
          movementType: "PURCHASE_RECEIPT" as MovementType,
          quantity: data.receivedQty, // Positive = inbound
          unitCost: data.costPerUnit,
          referenceType: "PURCHASE_RECEIPT",
          referenceId: data.purchaseOrderId ?? undefined,
          performedBy: user.id,
          notes: `Received batch ${data.batchNumber}`,
        },
      });

      // Audit
      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: "CREATE",
          tableName: "inventory_batches",
          recordId: batch.id,
          newData: {
            batchNumber: data.batchNumber,
            receivedQty: data.receivedQty,
            expiryDate: data.expiryDate,
          },
        },
      });

      return { batch, newTotalQty: updatedItem.totalQuantity };
    });

    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      data: {
        batchId: result.batch.id,
        newTotalQty: result.newTotalQty,
      },
    };
  } catch (error) {
    console.error("receiveBatch error:", error);
    return {
      success: false,
      error: "Failed to receive batch.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// DISPENSE MEDICINES (FEFO with SELECT FOR UPDATE)
// ============================================================

export type DispenseResult = {
  itemId: string;
  itemName: string;
  totalDispensed: number;
  batchesUsed: { batchId: string; batchNumber: string; qty: number }[];
};

export async function dispenseItems(
  input: z.infer<typeof dispenseSchema>
): Promise<ActionResult<DispenseResult[]>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  if (user.role !== "PHARMACIST" && user.role !== "ADMIN") {
    return {
      success: false,
      error: "Only pharmacists can dispense medicines.",
      code: "FORBIDDEN",
    };
  }

  const parsed = dispenseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Validation error",
      code: "VALIDATION_ERROR",
    };
  }

  const data = parsed.data;
  const results: DispenseResult[] = [];

  // Validate stock availability before any DB writes
  for (const dispenseItem of data.items) {
    const item = await prisma.inventoryItem.findFirst({
      where: { id: dispenseItem.inventoryItemId, tenantId: user.tenantId },
    });

    if (!item) {
      return {
        success: false,
        error: `Item ${dispenseItem.inventoryItemId} not found`,
        code: "NOT_FOUND",
      };
    }

    const availableTotal = item.totalQuantity - item.reservedQty;
    if (availableTotal < dispenseItem.quantity) {
      return {
        success: false,
        error: `Insufficient stock for ${item.name}. Available: ${availableTotal}, Requested: ${dispenseItem.quantity}`,
        code: "INSUFFICIENT_STOCK",
      };
    }
  }

  try {
    // Use a transaction with raw SQL for SELECT FOR UPDATE (FEFO)
    await prisma.$transaction(
      async (tx) => {
        for (const dispenseItem of data.items) {
          const item = await tx.inventoryItem.findFirst({
            where: { id: dispenseItem.inventoryItemId, tenantId: user.tenantId },
            select: { id: true, name: true },
          });

          if (!item) throw new Error(`Item ${dispenseItem.inventoryItemId} not found`);

          // FEFO: Get batches ordered by expiry date ASC, then received_at ASC
          // SELECT FOR UPDATE to prevent concurrent dispensing race condition
          const batches = await tx.$queryRaw<
            {
              id: string;
              batch_number: string;
              available_qty: number;
            }[]
          >`
            SELECT id, batch_number, available_qty
            FROM inventory_batches
            WHERE inventory_item_id = ${dispenseItem.inventoryItemId}
              AND available_qty > 0
              AND deleted_at IS NULL
              AND is_quarantined = false
              AND (expiry_date IS NULL OR expiry_date > NOW())
            ORDER BY 
              expiry_date ASC NULLS LAST,
              received_at ASC
            FOR UPDATE
          `;

          let remainingQty = dispenseItem.quantity;
          const batchesUsed: DispenseResult["batchesUsed"] = [];

          for (const batch of batches) {
            if (remainingQty <= 0) break;

            const takeFromBatch = Math.min(batch.available_qty, remainingQty);

            // Update batch available qty
            await tx.$executeRaw`
              UPDATE inventory_batches 
              SET available_qty = available_qty - ${takeFromBatch},
                  updated_at = NOW()
              WHERE id = ${batch.id}
            `;

            // Record stock movement per batch
            await tx.stockMovement.create({
              data: {
                tenantId: user.tenantId,
                inventoryItemId: dispenseItem.inventoryItemId,
                batchId: batch.id,
                movementType: "PATIENT_ISSUE" as MovementType,
                quantity: -takeFromBatch, // Negative = outbound
                referenceType: data.referenceType,
                referenceId: data.referenceId ?? undefined,
                performedBy: user.id,
                notes:
                  data.notes ??
                  `Dispensed from batch ${batch.batch_number}`,
              },
            });

            batchesUsed.push({
              batchId: batch.id,
              batchNumber: batch.batch_number,
              qty: takeFromBatch,
            });

            remainingQty -= takeFromBatch;
          }

          if (remainingQty > 0) {
            throw new Error(
              `Could not dispense full quantity for ${item.name}. Shortfall: ${remainingQty}`
            );
          }

          // Update item total quantity
          await tx.inventoryItem.update({
            where: { id: dispenseItem.inventoryItemId },
            data: { totalQuantity: { decrement: dispenseItem.quantity } },
          });

          results.push({
            itemId: item.id,
            itemName: item.name,
            totalDispensed: dispenseItem.quantity,
            batchesUsed,
          });
        }

        // Audit log
        await tx.auditLog.create({
          data: {
            tenantId: user.tenantId,
            userId: user.id,
            action: "UPDATE",
            tableName: "inventory_items",
            recordId: data.items.map((i) => i.inventoryItemId).join(","),
            newData: {
              action: "DISPENSE",
              referenceType: data.referenceType,
              referenceId: data.referenceId,
              items: data.items,
            },
          },
        });
      },
      {
        isolationLevel: "Serializable", // Prevent phantom reads during concurrent dispense
        timeout: 15000,
      }
    );

    revalidatePath("/dashboard/inventory");

    return { success: true, data: results };
  } catch (error) {
    console.error("dispenseItems error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Dispensing failed: ${msg}`,
      code: "DISPENSE_ERROR",
    };
  }
}

// ============================================================
// GET LOW STOCK ITEMS
// ============================================================

export async function getLowStockItems(): Promise<
  ActionResult<
    {
      id: string;
      itemCode: string;
      name: string;
      itemType: string;
      totalQuantity: number;
      reorderLevel: number;
      reorderQty: number;
      supplier: { name: string } | null;
    }[]
  >
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  try {
    const items = await prisma.inventoryItem.findMany({
      where: {
        tenantId: user.tenantId,
        isActive: true,
        deletedAt: null,
        // totalQuantity <= reorderLevel
        // Prisma doesn't support column comparison directly, use raw
      },
      include: {
        supplier: { select: { name: true } },
      },
      orderBy: { totalQuantity: "asc" },
    });

    // Filter in application layer (Prisma limitation for column comparison)
    const lowStock = items.filter(
      (item) => item.totalQuantity <= item.reorderLevel
    );

    return {
      success: true,
      data: lowStock.map((item) => ({
        id: item.id,
        itemCode: item.itemCode,
        name: item.name,
        itemType: item.itemType,
        totalQuantity: item.totalQuantity,
        reorderLevel: item.reorderLevel,
        reorderQty: item.reorderQty,
        supplier: item.supplier,
      })),
    };
  } catch (error) {
    console.error("getLowStockItems error:", error);
    return {
      success: false,
      error: "Failed to fetch low stock items.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// GET NEAR-EXPIRY BATCHES
// ============================================================

export async function getNearExpiryBatches(daysThreshold: number = 30): Promise<
  ActionResult<
    {
      batchId: string;
      batchNumber: string;
      expiryDate: string;
      daysUntilExpiry: number;
      availableQty: number;
      item: { id: string; name: string; itemCode: string };
    }[]
  >
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  try {
    const batches = await prisma.inventoryBatch.findMany({
      where: {
        deletedAt: null,
        availableQty: { gt: 0 },
        expiryDate: {
          lte: thresholdDate,
          gt: new Date(), // Not yet expired
        },
        inventoryItem: {
          tenantId: user.tenantId,
          isActive: true,
          deletedAt: null,
        },
      },
      include: {
        inventoryItem: {
          select: { id: true, name: true, itemCode: true },
        },
      },
      orderBy: { expiryDate: "asc" },
    });

    const now = new Date();
    return {
      success: true,
      data: batches.map((batch) => ({
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        expiryDate: batch.expiryDate!.toISOString(),
        daysUntilExpiry: Math.floor(
          (batch.expiryDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
        availableQty: batch.availableQty,
        item: batch.inventoryItem,
      })),
    };
  } catch (error) {
    console.error("getNearExpiryBatches error:", error);
    return {
      success: false,
      error: "Failed to fetch near-expiry batches.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// GET INVENTORY ITEMS LIST
// ============================================================

export async function getInventoryItems(params: {
  search?: string;
  itemType?: InventoryItemType;
  lowStockOnly?: boolean;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ items: unknown[]; total: number }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const page = params.page ?? 1;
  const limit = params.limit ?? 25;
  const skip = (page - 1) * limit;

  const where: Prisma.InventoryItemWhereInput = {
    tenantId: user.tenantId,
    isActive: true,
    deletedAt: null,
  };

  if (params.itemType) where.itemType = params.itemType;

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { genericName: { contains: params.search, mode: "insensitive" } },
      { itemCode: { contains: params.search, mode: "insensitive" } },
    ];
  }

  try {
    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit,
        include: {
          supplier: { select: { id: true, name: true } },
          batches: {
            where: { deletedAt: null, availableQty: { gt: 0 } },
            orderBy: { expiryDate: "asc" },
            take: 3,
            select: {
              id: true,
              batchNumber: true,
              expiryDate: true,
              availableQty: true,
            },
          },
        },
      }),
      prisma.inventoryItem.count({ where }),
    ]);

    // Filter low stock in app layer if needed
    const filteredItems = params.lowStockOnly
      ? items.filter((item) => item.totalQuantity <= item.reorderLevel)
      : items;

    return {
      success: true,
      data: { items: filteredItems, total },
    };
  } catch (error) {
    console.error("getInventoryItems error:", error);
    return {
      success: false,
      error: "Failed to fetch inventory.",
      code: "DB_ERROR",
    };
  }
}
