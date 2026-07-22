# 🏥 KrishnaHealth ERP
### Dr. Amit Jha Sports Injury Clinic, Varanasi

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/supabase-%233FCF8E.svg?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/prisma-%232D3748.svg?style=for-the-badge&logo=prisma&logoColor=white)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Environment Variables](#-environment-variables)
- [Setup Instructions](#-setup-instructions)
- [Supabase Setup](#-supabase-setup)
- [Module List](#-module-list)
- [License](#-license)

---

## 🌟 Features

- **Next.js 15 App Router** & strict **TypeScript**
- **Complete Prisma Schema (24 models):** Patients, appointments, OT, consultations, EMR, inventory, billing, accounting
- **Role-Based Access Control (RBAC):** Admin, Receptionist, Doctor, Physio, Pharmacist, Accountant
- **Supabase SSR Authentication:** Complete session management and middleware
- **Department Modules:** Orthopedic, Pediatrics, Physiotherapy
- **OT Surgery Scheduling:** Phase 1 integration
- **Inventory Management:** FEFO tracking with consignment implant tracking
- **Billing & Accounting:** GST-compliant billing with double-entry accounting
- **Physiotherapy Scheduler:** 11:00-13:30 and 15:30-20:30 IST (30-min slots)
- **UI/UX:** Premium glassmorphism UI with teal/blue brand colors

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS, Framer Motion, shadcn/ui |
| **Database ORM** | Prisma |
| **Authentication/DB** | Supabase |
| **State Management** | Zustand, TanStack Query |
| **Forms/Validation** | React Hook Form, Zod |

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `DATABASE_URL` | PostgreSQL connection string for Prisma |
| `DIRECT_URL` | Direct connection string for Prisma (optional, depending on Supabase setup) |

---

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/kara-india/dramitjha.git
   cd dramitjha
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env` (or `.env.local`) and add your database and Supabase credentials.
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Prisma Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup

Ensure you have a Supabase project created. You can link your local project to Supabase and pull down the configuration.
Make sure you enable Email Auth and apply RLS policies as necessary.

---

## 📦 Module List

- **Patients:** Registration, history, EMR integration
- **Appointments:** OPD scheduler, physio slot booking
- **OT (Operation Theater):** Surgery scheduling, surgeon allocation
- **Consultations:** Digital prescriptions, doctor notes
- **EMR:** Electronic Medical Records, lab reports
- **Inventory:** Pharmacy stock, OT consumables, FEFO implementation
- **Billing:** Invoicing, GST integration, receipt generation
- **Accounting:** Ledger, double-entry bookkeeping, daily cash reconciliation

---

## 📄 License

This project is licensed under the MIT License.
