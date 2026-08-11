# Asset Management & Ticketing Management System

A production-quality, enterprise-grade, FRONTEND-ONLY SaaS application built with **React**, **Vite**, **Tailwind CSS**, **Recharts**, **Lucide React**, and **localStorage API-ready services**.

---

## 🌟 Key Features & Modules

1. **Enterprise Dashboard**: Real-time dynamic state calculations across tickets, assets, projects, agreements, licenses, stationery, and expenses. Includes interactive Recharts analytics and a global recent activity stream.
2. **Unified Ticketing & Complaint Management**: Single platform for IT, Admin, HVAC, Electrical, UPS, Plumbing, and Furniture tickets. Includes SLA countdown timer, comment thread, resolution workflow, 1-5 star feedback rating, and ticket reopen support.
3. **Email Ticket Simulator**: Demo simulator transforming incoming emails into routed tickets with Complaint Matrix auto-matching.
4. **Configurable Complaint Matrix**: Dynamic rule engine assigning Category, Priority, SLA target hours, and Responsible Team.
5. **IT Asset Management & Lifecycle**: Hardware, Network, Peripherals tracking. Features asset transfer, physical audit mode, SVG QR/Barcode label modal, and bulk CSV upload parser.
6. **Admin & Building Maintenance**: Maintenance requests, vendor/technician assignment, and auto-logging into expense ledgers upon completion.
7. **Enterprise Project Management**: Projects tracking with task checklists, milestone progress bars, and budget vs. spent analytics.
8. **Agreements & AMC**: Vendor contracts tracking with 90/60/30/15 day expiration warnings.
9. **License Management**: Software seat utilization tracking (`Available = Total - Used`) and compliance status indicators.
10. **Inward, Outward & Courier Management**: Material receiving logs, outward dispatch authorization, courier booking with AWB tracking timeline.
11. **Stationery Inventory Control**: Inventory master using formula `Opening Stock + Stock In - Stock Out = Current Stock`, with low-stock warnings.
12. **Centralized Expense Ledger**: Consolidated financial tracking integrated across maintenance, stationery, projects, and courier.
13. **Centralized Notifications & Custom Reminders**: Idempotent alert evaluator with custom reminder scheduler and rendered HTML email preview modal.
14. **Custom Report Builder & Client-Side Exports**: Custom report builder with dynamic charts and instant **Excel (`xlsx`)** and **PDF (`jspdf`)** exports.
15. **Append-Only Audit Log Simulation**: Read-only activity log recording all CRUD operations and state changes.
16. **Settings Portal & Data Management**: Master registries (Users, Departments, Locations, Teams, Vendors), JSON backup export, JSON restore import, and demo data reset.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms & State**: React Hook Form, Context API, localStorage
- **Exports**: SheetJS (`xlsx`), jsPDF (`jspdf`, `jspdf-autotable`)

---

## 🔑 Demo Login Accounts

**Default Password for ALL Accounts:** `demo123`

| Role | Demo Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@enterprise.com` | `demo123` |
| **Admin** | `krunal.patel@enterprise.com` | `demo123` |
| **IT Admin** | `rahul.mehta@enterprise.com` | `demo123` |
| **Manager** | `priya.sharma@enterprise.com` | `demo123` |
| **Technician** | `amit.joshi@enterprise.com` | `demo123` |
| **End User** | `neha.gupta@enterprise.com` | `demo123` |
| **Project Manager** | `suresh.kumar@enterprise.com` | `demo123` |
| **Inventory Manager**| `ramesh.patel@enterprise.com` | `demo123` |
| **Finance** | `vikram.joshi@enterprise.com` | `demo123` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:3000`.

### Production Build

```bash
npm run build
```
