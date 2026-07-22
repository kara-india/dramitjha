/**
 * KrishnaHealth ERP — Database Seed Script
 * Dr. Amit Jha Sports Injury Clinic, Varanasi
 *
 * Creates:
 * 1. Tenant (Dr. Amit Jha clinic)
 * 2. Default accounts (Chart of Accounts)
 * 3. GST rates for healthcare
 * 4. Sample users (for development)
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KrishnaHealth ERP database...");

  // ============================================================
  // 1. CREATE TENANT
  // ============================================================
  const tenant = await prisma.tenant.upsert({
    where: { id: "default-tenant-id" },
    update: {},
    create: {
      id: "default-tenant-id",
      name: "Dr. Amit Jha Sports Injury Clinic",
      legalName: "Dr. Amit Jha Sports Injury Clinic",
      address: "Sigra, Varanasi",
      city: "Varanasi",
      state: "Uttar Pradesh",
      pincode: "221010",
      phone: "0542-XXXXXXX",
      email: "admin@dramitjha.in",
      timezone: "Asia/Kolkata",
      currency: "INR",
      isActive: true,
    },
  });

  console.log(`✅ Tenant created: ${tenant.name}`);

  // ============================================================
  // 2. CHART OF ACCOUNTS
  // ============================================================
  const accounts = [
    // ASSETS
    { accountCode: "1000", accountName: "Current Assets", accountType: "ASSET" as const, isSystem: false },
    { accountCode: "1010", accountName: "Cash on Hand", accountType: "ASSET" as const, isSystem: true },
    { accountCode: "1020", accountName: "Bank Account - HDFC", accountType: "ASSET" as const, isSystem: false },
    { accountCode: "1030", accountName: "UPI Collections", accountType: "ASSET" as const, isSystem: false },
    { accountCode: "1100", accountName: "Accounts Receivable", accountType: "ASSET" as const, isSystem: true },
    { accountCode: "1110", accountName: "TPA Receivable", accountType: "ASSET" as const, isSystem: false },
    { accountCode: "1200", accountName: "Inventory - Pharmacy", accountType: "ASSET" as const, isSystem: false },
    { accountCode: "1210", accountName: "Inventory - Implants", accountType: "ASSET" as const, isSystem: false },
    { accountCode: "1500", accountName: "Fixed Assets", accountType: "ASSET" as const, isSystem: false },
    { accountCode: "1510", accountName: "Medical Equipment", accountType: "ASSET" as const, isSystem: false },
    
    // LIABILITIES
    { accountCode: "2000", accountName: "Current Liabilities", accountType: "LIABILITY" as const, isSystem: false },
    { accountCode: "2100", accountName: "Accounts Payable", accountType: "LIABILITY" as const, isSystem: true },
    { accountCode: "2200", accountName: "CGST Payable", accountType: "LIABILITY" as const, isSystem: true },
    { accountCode: "2210", accountName: "SGST Payable", accountType: "LIABILITY" as const, isSystem: true },
    { accountCode: "2220", accountName: "IGST Payable", accountType: "LIABILITY" as const, isSystem: true },
    { accountCode: "2300", accountName: "TDS Payable", accountType: "LIABILITY" as const, isSystem: false },
    { accountCode: "2400", accountName: "Patient Deposits", accountType: "LIABILITY" as const, isSystem: false },
    
    // EQUITY
    { accountCode: "3000", accountName: "Owner's Equity", accountType: "EQUITY" as const, isSystem: false },
    { accountCode: "3100", accountName: "Retained Earnings", accountType: "EQUITY" as const, isSystem: false },
    
    // REVENUE
    { accountCode: "4000", accountName: "Total Revenue", accountType: "REVENUE" as const, isSystem: true },
    { accountCode: "4100", accountName: "Consultation Revenue", accountType: "REVENUE" as const, isSystem: false },
    { accountCode: "4200", accountName: "Procedure Revenue", accountType: "REVENUE" as const, isSystem: false },
    { accountCode: "4300", accountName: "Pharmacy Revenue", accountType: "REVENUE" as const, isSystem: false },
    { accountCode: "4400", accountName: "Physiotherapy Revenue", accountType: "REVENUE" as const, isSystem: false },
    { accountCode: "4500", accountName: "OT / Surgical Revenue", accountType: "REVENUE" as const, isSystem: false },
    { accountCode: "4600", accountName: "Diagnostics Revenue", accountType: "REVENUE" as const, isSystem: false },
    { accountCode: "4700", accountName: "Vaccination Revenue", accountType: "REVENUE" as const, isSystem: false },
    
    // EXPENSES
    { accountCode: "5000", accountName: "Total Expenses", accountType: "EXPENSE" as const, isSystem: true },
    { accountCode: "5100", accountName: "Medical Supplies", accountType: "EXPENSE" as const, isSystem: false },
    { accountCode: "5200", accountName: "Staff Salaries", accountType: "EXPENSE" as const, isSystem: false },
    { accountCode: "5300", accountName: "Rent & Utilities", accountType: "EXPENSE" as const, isSystem: false },
    { accountCode: "5400", accountName: "Equipment Maintenance", accountType: "EXPENSE" as const, isSystem: false },
    { accountCode: "5500", accountName: "Administrative Expenses", accountType: "EXPENSE" as const, isSystem: false },
    { accountCode: "5600", accountName: "Bank Charges", accountType: "EXPENSE" as const, isSystem: false },
  ];

  for (const account of accounts) {
    await prisma.account.upsert({
      where: {
        tenantId_accountCode: {
          tenantId: tenant.id,
          accountCode: account.accountCode,
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        ...account,
      },
    });
  }

  console.log(`✅ Chart of Accounts created: ${accounts.length} accounts`);

  // ============================================================
  // 3. GST RATES FOR HEALTHCARE
  // ============================================================
  const gstRates = [
    // Medical services are generally EXEMPT from GST
    {
      sacHsnCode: "9993",
      description: "Health care services (medical consultation, hospitalization)",
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
      isExempt: true,
    },
    // Medicines
    {
      sacHsnCode: "3004",
      description: "Medicaments - pharmaceutical products",
      cgstRate: 6,
      sgstRate: 6,
      igstRate: 12,
      isExempt: false,
    },
    // Medical devices / implants
    {
      sacHsnCode: "9021",
      description: "Orthopaedic appliances and implants",
      cgstRate: 6,
      sgstRate: 6,
      igstRate: 12,
      isExempt: false,
    },
    // Consumables
    {
      sacHsnCode: "3005",
      description: "Medical/surgical disposables",
      cgstRate: 6,
      sgstRate: 6,
      igstRate: 12,
      isExempt: false,
    },
    // Vaccines
    {
      sacHsnCode: "3002",
      description: "Vaccines and biological preparations",
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
      isExempt: false,
    },
    // Physiotherapy equipment
    {
      sacHsnCode: "9018",
      description: "Physiotherapy equipment and instruments",
      cgstRate: 6,
      sgstRate: 6,
      igstRate: 12,
      isExempt: false,
    },
  ];

  for (const rate of gstRates) {
    await prisma.gSTRate.upsert({
      where: {
        tenantId_sacHsnCode: {
          tenantId: tenant.id,
          sacHsnCode: rate.sacHsnCode,
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        ...rate,
      },
    });
  }

  console.log(`✅ GST rates seeded: ${gstRates.length} rates`);

  // ============================================================
  // 4. SAMPLE INVENTORY ITEMS (Development only)
  // ============================================================
  if (process.env.NODE_ENV !== "production") {
    const sampleItems = [
      {
        itemCode: "MED-001",
        name: "Diclofenac Sodium 50mg",
        genericName: "Diclofenac Sodium",
        category: "NSAID",
        itemType: "MEDICINE" as const,
        unit: "tablets",
        packSize: 10,
        mrp: 65.0,
        sellingPrice: 60.0,
        hsnCode: "3004",
        gstPercent: 12,
        reorderLevel: 100,
        reorderQty: 500,
        requiresPrescription: false,
        isNarcotic: false,
        requiresColdChain: false,
        isConsignment: false,
        totalQuantity: 250,
      },
      {
        itemCode: "MED-002",
        name: "Paracetamol 500mg",
        genericName: "Paracetamol",
        category: "Analgesic",
        itemType: "MEDICINE" as const,
        unit: "tablets",
        packSize: 10,
        mrp: 25.0,
        sellingPrice: 22.0,
        hsnCode: "3004",
        gstPercent: 12,
        reorderLevel: 200,
        reorderQty: 1000,
        requiresPrescription: false,
        isNarcotic: false,
        requiresColdChain: false,
        isConsignment: false,
        totalQuantity: 450,
      },
      {
        itemCode: "IMP-001",
        name: "ACL Graft Anchor (Arthrex TightRope)",
        genericName: "ACL Fixation Device",
        category: "Orthopedic Implant",
        itemType: "CONSIGNMENT_IMPLANT" as const,
        unit: "pieces",
        packSize: 1,
        mrp: 45000.0,
        sellingPrice: 48000.0,
        hsnCode: "9021",
        gstPercent: 12,
        reorderLevel: 2,
        reorderQty: 5,
        requiresPrescription: false,
        isNarcotic: false,
        requiresColdChain: false,
        isConsignment: true,
        totalQuantity: 3,
      },
      {
        itemCode: "VAC-001",
        name: "Varicella Vaccine (Varivax)",
        genericName: "Varicella Live Attenuated",
        category: "Vaccine",
        itemType: "VACCINE" as const,
        unit: "vials",
        packSize: 1,
        mrp: 1200.0,
        sellingPrice: 1150.0,
        hsnCode: "3002",
        gstPercent: 0,
        reorderLevel: 5,
        reorderQty: 20,
        requiresPrescription: false,
        isNarcotic: false,
        requiresColdChain: true,
        isConsignment: false,
        totalQuantity: 15,
      },
      {
        itemCode: "CON-001",
        name: "Surgical Gloves (Medium)",
        genericName: "Latex-free Surgical Gloves",
        category: "Consumable",
        itemType: "CONSUMABLE" as const,
        unit: "pairs",
        packSize: 50,
        mrp: 450.0,
        sellingPrice: 420.0,
        hsnCode: "3005",
        gstPercent: 12,
        reorderLevel: 10,
        reorderQty: 50,
        requiresPrescription: false,
        isNarcotic: false,
        requiresColdChain: false,
        isConsignment: false,
        totalQuantity: 25,
      },
    ];

    for (const item of sampleItems) {
      await prisma.inventoryItem.upsert({
        where: {
          tenantId_itemCode: {
            tenantId: tenant.id,
            itemCode: item.itemCode,
          },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          ...item,
        },
      });
    }

    console.log(`✅ Sample inventory items seeded: ${sampleItems.length} items`);
  }

  console.log("\n✨ Database seeding complete!");
  console.log("\nNext steps:");
  console.log("1. Create a Supabase project and update .env.local");
  console.log("2. Run: npx prisma db push (to sync schema)");
  console.log("3. Create user accounts via Supabase Auth dashboard");
  console.log("4. Register users in the users table with their supabaseUserId");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
