/**
 * KrishnaHealth ERP — Server Actions: Billing & Invoices
 * GST-compliant invoicing for Dr. Amit Jha Sports Injury Clinic
 *
 * Implements:
 * - Invoice creation with line items
 * - GST calculation (CGST+SGST for UP, IGST for interstate)
 * - Payment recording
 * - TPA/Insurance claim tracking
 * - Double-entry journal entries
 */
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/(auth)/login/actions";
import { generateDocumentNumber, calculateGST } from "@/lib/utils";
import { z } from "zod";
import type {
  InvoiceStatus,
  PaymentMode,
  JournalEntryType,
  Prisma,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/app/(auth)/login/actions";

// ============================================================
// SCHEMAS
// ============================================================

const lineItemSchema = z.object({
  inventoryItemId: z.string().optional().nullable(),
  itemType: z.enum([
    "CONSULTATION",
    "PROCEDURE",
    "MEDICINE",
    "CONSUMABLE",
    "ROOM",
    "IMPLANT",
    "VACCINE",
    "OTHER",
  ]),
  description: z.string().min(1),
  hsnSacCode: z.string().optional(),
  quantity: z.number().positive().default(1),
  unitPrice: z.number().nonnegative(),
  discountPercent: z.number().min(0).max(100).default(0),
  cgstRate: z.number().min(0).max(28).default(0),
  sgstRate: z.number().min(0).max(28).default(0),
  igstRate: z.number().min(0).max(28).default(0),
  doctorId: z.string().optional().nullable(),
});

const createInvoiceSchema = z.object({
  patientId: z.string().min(1),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
  discountAmount: z.number().nonnegative().default(0),
  discountPercent: z.number().min(0).max(100).default(0),
  patientState: z.string().default("Uttar Pradesh"),
  insuranceCoveredAmount: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  dueDate: z.string().optional().nullable(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type LineItemInput = z.infer<typeof lineItemSchema>;

const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  paymentMode: z.enum([
    "CASH",
    "UPI",
    "CARD_CREDIT",
    "CARD_DEBIT",
    "INSURANCE_TPA",
    "SPLIT",
    "ONLINE_TRANSFER",
  ]),
  amount: z.number().positive("Payment amount must be positive"),
  transactionId: z.string().optional(),
  chequeNo: z.string().optional(),
  bankName: z.string().optional(),
  tpaId: z.string().optional(),
  tdsAmount: z.number().nonnegative().default(0),
  notes: z.string().optional(),
});

// ============================================================
// CALCULATE LINE ITEM TOTALS
// ============================================================

function calculateLineItemTotals(
  item: LineItemInput,
  isInterstate: boolean
): {
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
} {
  const subtotal = item.quantity * item.unitPrice;
  const discountAmt = (subtotal * item.discountPercent) / 100;
  const taxableAmount = Math.round((subtotal - discountAmt) * 100) / 100;

  const gstRate = isInterstate
    ? item.igstRate
    : item.cgstRate + item.sgstRate;

  const gst = calculateGST(
    taxableAmount,
    gstRate,
    isInterstate ? "IGST" : gstRate > 0 ? "CGST_SGST" : "EXEMPT"
  );

  return {
    taxableAmount,
    cgstAmount: gst.cgstAmount,
    sgstAmount: gst.sgstAmount,
    igstAmount: gst.igstAmount,
    totalAmount: gst.totalWithTax,
  };
}

// ============================================================
// CREATE INVOICE
// ============================================================

export async function createInvoice(
  input: CreateInvoiceInput
): Promise<ActionResult<{ id: string; invoiceNumber: string; total: number }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const parsed = createInvoiceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
      code: "VALIDATION_ERROR",
    };
  }

  const data = parsed.data;

  // Determine if interstate (clinic is UP, patient in another state)
  const isInterstate =
    data.patientState !== "Uttar Pradesh" && data.patientState !== "UP";

  // Calculate all line items
  const processedItems = data.lineItems.map((item) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmt = (subtotal * item.discountPercent) / 100;
    const totals = calculateLineItemTotals(item, isInterstate);
    return {
      ...item,
      discountAmount: discountAmt,
      taxableAmount: totals.taxableAmount,
      cgstAmount: isInterstate ? 0 : totals.cgstAmount,
      sgstAmount: isInterstate ? 0 : totals.sgstAmount,
      igstAmount: isInterstate ? totals.igstAmount : 0,
      totalAmount: totals.totalAmount,
    };
  });

  // Invoice level totals
  const subtotal = processedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxableAmount = processedItems.reduce(
    (sum, item) => sum + item.taxableAmount,
    0
  );
  const cgstAmount = processedItems.reduce(
    (sum, item) => sum + item.cgstAmount,
    0
  );
  const sgstAmount = processedItems.reduce(
    (sum, item) => sum + item.sgstAmount,
    0
  );
  const igstAmount = processedItems.reduce(
    (sum, item) => sum + item.igstAmount,
    0
  );

  const invoiceDiscount =
    data.discountAmount > 0
      ? data.discountAmount
      : (taxableAmount * data.discountPercent) / 100;

  const totalAmount =
    taxableAmount - invoiceDiscount + cgstAmount + sgstAmount + igstAmount;
  const patientResponsibility = totalAmount - data.insuranceCoveredAmount;
  const balanceAmount = patientResponsibility;

  // Generate invoice number
  const count = await prisma.invoice.count({
    where: { tenantId: user.tenantId },
  });
  const invoiceNumber = generateDocumentNumber("INV", count + 1);

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      // Create invoice
      const inv = await tx.invoice.create({
        data: {
          tenantId: user.tenantId,
          patientId: data.patientId,
          createdById: user.id,
          invoiceNumber,
          status: "CONFIRMED",
          subtotal: Math.round(subtotal * 100) / 100,
          discountAmount: Math.round(invoiceDiscount * 100) / 100,
          discountPercent: data.discountPercent,
          taxableAmount: Math.round(taxableAmount * 100) / 100,
          cgstAmount: Math.round(cgstAmount * 100) / 100,
          sgstAmount: Math.round(sgstAmount * 100) / 100,
          igstAmount: Math.round(igstAmount * 100) / 100,
          totalAmount: Math.round(totalAmount * 100) / 100,
          paidAmount: 0,
          balanceAmount: Math.round(balanceAmount * 100) / 100,
          insuranceCoveredAmount: data.insuranceCoveredAmount,
          patientResponsibility: Math.round(patientResponsibility * 100) / 100,
          patientState: data.patientState,
          notes: data.notes,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          confirmedAt: new Date(),
          lineItems: {
            create: processedItems.map((item, idx) => ({
              inventoryItemId: item.inventoryItemId ?? null,
              itemType: item.itemType,
              description: item.description,
              hsnSacCode: item.hsnSacCode ?? null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discountPercent: item.discountPercent,
              discountAmount: Math.round(item.discountAmount * 100) / 100,
              taxableAmount: Math.round(item.taxableAmount * 100) / 100,
              cgstRate: isInterstate ? 0 : item.cgstRate,
              cgstAmount: Math.round(item.cgstAmount * 100) / 100,
              sgstRate: isInterstate ? 0 : item.sgstRate,
              sgstAmount: Math.round(item.sgstAmount * 100) / 100,
              igstRate: isInterstate ? item.igstRate : 0,
              igstAmount: Math.round(item.igstAmount * 100) / 100,
              totalAmount: Math.round(item.totalAmount * 100) / 100,
              doctorId: item.doctorId ?? null,
              sortOrder: idx,
            })),
          },
        },
      });

      // Create double-entry journal entry
      // DR: Accounts Receivable
      // CR: Revenue accounts (by item type)
      const arAccount = await tx.account.findFirst({
        where: {
          tenantId: user.tenantId,
          accountCode: "1100", // Accounts Receivable
        },
      });

      const revenueAccount = await tx.account.findFirst({
        where: {
          tenantId: user.tenantId,
          accountCode: "4000", // General Revenue
        },
      });

      if (arAccount && revenueAccount) {
        await tx.journalEntry.create({
          data: {
            tenantId: user.tenantId,
            invoiceId: inv.id,
            entryType: "INVOICE_RAISED" as JournalEntryType,
            referenceNo: invoiceNumber,
            description: `Invoice ${invoiceNumber} raised`,
            totalDebit: Math.round(totalAmount * 100) / 100,
            totalCredit: Math.round(totalAmount * 100) / 100,
            lines: {
              create: [
                {
                  accountId: arAccount.id,
                  debitAmount: Math.round(totalAmount * 100) / 100,
                  creditAmount: 0,
                  narration: `Invoice ${invoiceNumber}`,
                },
                {
                  accountId: revenueAccount.id,
                  debitAmount: 0,
                  creditAmount: Math.round(taxableAmount * 100) / 100,
                  narration: `Revenue from Invoice ${invoiceNumber}`,
                },
              ],
            },
          },
        });

        // Update AR account balance
        await tx.account.update({
          where: { id: arAccount.id },
          data: {
            balance: {
              increment: Math.round(totalAmount * 100) / 100,
            },
          },
        });

        await tx.account.update({
          where: { id: revenueAccount.id },
          data: {
            balance: {
              increment: Math.round(taxableAmount * 100) / 100,
            },
          },
        });
      }

      // Audit
      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: "CREATE",
          tableName: "invoices",
          recordId: inv.id,
          newData: {
            invoiceNumber,
            patientId: data.patientId,
            totalAmount: Math.round(totalAmount * 100) / 100,
          },
        },
      });

      return inv;
    });

    revalidatePath("/dashboard/billing");

    return {
      success: true,
      data: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        total: Math.round(totalAmount * 100) / 100,
      },
    };
  } catch (error) {
    console.error("createInvoice error:", error);
    return {
      success: false,
      error: "Failed to create invoice. Please try again.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// RECORD PAYMENT
// ============================================================

export async function recordPayment(
  input: z.infer<typeof recordPaymentSchema>
): Promise<ActionResult<{ id: string; newBalance: number }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const parsed = recordPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
      code: "VALIDATION_ERROR",
    };
  }

  const data = parsed.data;

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: data.invoiceId,
      tenantId: user.tenantId,
      deletedAt: null,
    },
  });

  if (!invoice) {
    return { success: false, error: "Invoice not found", code: "NOT_FOUND" };
  }

  if (invoice.status === "CANCELLED") {
    return {
      success: false,
      error: "Cannot record payment on cancelled invoice",
      code: "INVALID_STATUS",
    };
  }

  const currentBalance = Number(invoice.balanceAmount);

  if (data.amount > currentBalance + 0.01) {
    return {
      success: false,
      error: `Payment amount (₹${data.amount}) exceeds outstanding balance (₹${currentBalance.toFixed(2)})`,
      code: "OVERPAYMENT",
    };
  }

  const newPaidAmount = Number(invoice.paidAmount) + data.amount - data.tdsAmount;
  const newBalance = Math.max(0, currentBalance - data.amount);

  const newStatus: InvoiceStatus =
    newBalance < 0.01 ? "PAID" : "PARTIALLY_PAID";

  try {
    const payment = await prisma.$transaction(async (tx) => {
      const pay = await tx.payment.create({
        data: {
          tenantId: user.tenantId,
          invoiceId: data.invoiceId,
          receivedById: user.id,
          paymentMode: data.paymentMode as PaymentMode,
          amount: data.amount,
          transactionId: data.transactionId ?? null,
          chequeNo: data.chequeNo ?? null,
          bankName: data.bankName ?? null,
          tpaId: data.tpaId ?? null,
          tdsAmount: data.tdsAmount,
          notes: data.notes ?? null,
        },
      });

      await tx.invoice.update({
        where: { id: data.invoiceId },
        data: {
          paidAmount: Math.round(newPaidAmount * 100) / 100,
          balanceAmount: Math.round(newBalance * 100) / 100,
          status: newStatus,
        },
      });

      // Journal: DR Cash/Bank, CR Accounts Receivable
      const cashAccount = await tx.account.findFirst({
        where: { tenantId: user.tenantId, accountCode: "1010" }, // Cash
      });
      const arAccount = await tx.account.findFirst({
        where: { tenantId: user.tenantId, accountCode: "1100" }, // AR
      });

      if (cashAccount && arAccount) {
        await tx.journalEntry.create({
          data: {
            tenantId: user.tenantId,
            invoiceId: data.invoiceId,
            entryType: "PAYMENT_RECEIVED" as JournalEntryType,
            referenceNo: invoice.invoiceNumber,
            description: `Payment received for ${invoice.invoiceNumber} via ${data.paymentMode}`,
            totalDebit: data.amount,
            totalCredit: data.amount,
            lines: {
              create: [
                {
                  accountId: cashAccount.id,
                  debitAmount: data.amount,
                  creditAmount: 0,
                  narration: `Payment received - ${data.paymentMode}`,
                },
                {
                  accountId: arAccount.id,
                  debitAmount: 0,
                  creditAmount: data.amount,
                  narration: `Settlement of Invoice ${invoice.invoiceNumber}`,
                },
              ],
            },
          },
        });

        await tx.account.update({
          where: { id: cashAccount.id },
          data: { balance: { increment: data.amount } },
        });
        await tx.account.update({
          where: { id: arAccount.id },
          data: { balance: { decrement: data.amount } },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: "CREATE",
          tableName: "payments",
          recordId: pay.id,
          newData: {
            invoiceId: data.invoiceId,
            amount: data.amount,
            paymentMode: data.paymentMode,
          },
        },
      });

      return pay;
    });

    revalidatePath("/dashboard/billing");
    revalidatePath(`/dashboard/billing/${data.invoiceId}`);

    return {
      success: true,
      data: { id: payment.id, newBalance },
    };
  } catch (error) {
    console.error("recordPayment error:", error);
    return {
      success: false,
      error: "Failed to record payment.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// GET INVOICES
// ============================================================

export async function getInvoices(params: {
  patientId?: string;
  status?: InvoiceStatus[];
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ invoices: unknown[]; total: number }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const page = params.page ?? 1;
  const limit = params.limit ?? 25;
  const skip = (page - 1) * limit;

  const where: Prisma.InvoiceWhereInput = {
    tenantId: user.tenantId,
    deletedAt: null,
  };

  if (params.patientId) where.patientId = params.patientId;
  if (params.status?.length) where.status = { in: params.status };

  if (params.startDate || params.endDate) {
    where.invoiceDate = {};
    if (params.startDate) {
      (where.invoiceDate as Prisma.DateTimeFilter).gte = new Date(params.startDate);
    }
    if (params.endDate) {
      (where.invoiceDate as Prisma.DateTimeFilter).lte = new Date(params.endDate);
    }
  }

  if (params.search) {
    where.OR = [
      { invoiceNumber: { contains: params.search, mode: "insensitive" } },
      {
        patient: {
          OR: [
            { mrn: { contains: params.search, mode: "insensitive" } },
            { firstName: { contains: params.search, mode: "insensitive" } },
            { lastName: { contains: params.search, mode: "insensitive" } },
          ],
        },
      },
    ];
  }

  try {
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { invoiceDate: "desc" },
        skip,
        take: limit,
        include: {
          patient: {
            select: {
              id: true,
              mrn: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
          _count: {
            select: { lineItems: true, payments: true },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      success: true,
      data: { invoices, total },
    };
  } catch (error) {
    console.error("getInvoices error:", error);
    return {
      success: false,
      error: "Failed to fetch invoices.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// GET DAILY COLLECTION SUMMARY
// ============================================================

export async function getDailyCollectionSummary(date?: string): Promise<
  ActionResult<{
    totalAmount: number;
    byMode: { mode: string; amount: number; count: number }[];
    invoiceCount: number;
    paidInvoices: number;
  }>
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const targetDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const payments = await prisma.payment.findMany({
      where: {
        tenantId: user.tenantId,
        paymentDate: { gte: startOfDay, lte: endOfDay },
        isRefund: false,
      },
      select: { paymentMode: true, amount: true },
    });

    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    const byModeMap = new Map<string, { amount: number; count: number }>();
    for (const payment of payments) {
      const mode = payment.paymentMode;
      const existing = byModeMap.get(mode) ?? { amount: 0, count: 0 };
      byModeMap.set(mode, {
        amount: existing.amount + Number(payment.amount),
        count: existing.count + 1,
      });
    }

    const byMode = Array.from(byModeMap.entries()).map(([mode, data]) => ({
      mode,
      ...data,
    }));

    const [invoiceCount, paidInvoices] = await Promise.all([
      prisma.invoice.count({
        where: {
          tenantId: user.tenantId,
          invoiceDate: { gte: startOfDay, lte: endOfDay },
          deletedAt: null,
        },
      }),
      prisma.invoice.count({
        where: {
          tenantId: user.tenantId,
          invoiceDate: { gte: startOfDay, lte: endOfDay },
          status: "PAID",
          deletedAt: null,
        },
      }),
    ]);

    return {
      success: true,
      data: { totalAmount, byMode, invoiceCount, paidInvoices },
    };
  } catch (error) {
    console.error("getDailyCollectionSummary error:", error);
    return {
      success: false,
      error: "Failed to fetch daily summary.",
      code: "DB_ERROR",
    };
  }
}
