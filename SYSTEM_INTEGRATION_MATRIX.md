# CARFLEX FULL-STACK DNA: The 4D Traceability Matrix

**System Scope:** 150 Operational Flows | 29 Pages | 19 Modals | 18 Database Tables

This document connects the physical event reality to the UI, API, and the exact database data types. It serves as the ultimate map for developers to see how one click affects the entire ecosystem.

---

## PART 1: THE 18-TABLE SCHEMA (Columns, Types & Connections)
This is the exact architecture that powers the system.

### A. Identity & Core Users
**profiles (Core User Data)**
*   `id` (uuid, PK) -> Connects to auth.users
*   `full_name` (text)
*   `phone_number` (text, UNIQUE, INDEXED)
*   `id_number` (text, UNIQUE)
*   `role` (enum: admin, staff, vendor, buyer, student)
*   `avatar_url` (text)
*   `created_at` (timestamp)

### B. Bazaar & Spatial Operations
**events (Bazaar Days)**
*   `id` (uuid, PK)
*   `date` (date, INDEXED)
*   `is_active` (boolean)

**zones (Parking Logistics)**
*   `id` (uuid, PK)
*   `event_id` (uuid, FK -> events.id)
*   `name` (text)
*   `capacity` (integer)
*   `occupancy` (integer)
*   `price` (numeric)

**bookings (The Parking Ticket)**
*   `id` (uuid, PK)
*   `vehicle_id` (uuid, FK -> vehicles.id)
*   `zone_id` (uuid, FK -> zones.id)
*   `payment_status` (enum: paid, pending, failed)
*   `check_in_at` (timestamp)
*   `exit_at` (timestamp, NULLABLE)

**exit_passes (Security Gate Logic)**
*   `id` (uuid, PK)
*   `booking_id` (uuid, FK -> bookings.id)
*   `qr_jwt_hash` (text, UNIQUE)
*   `is_used` (boolean, DEFAULT false)

### C. The Vehicle Asset
**vehicles (The Core Commodity)**
*   `id` (uuid, PK)
*   `owner_id` (uuid, FK -> profiles.id)
*   `reg_number` (text, UNIQUE, INDEXED)
*   `make` (text) | `model` (text) | `year` (integer)
*   `price` (numeric, INDEXED)
*   `status` (enum: draft, active, sold, in_garage)
*   `is_verified` (boolean, DEFAULT false)
*   `is_complete` (boolean, DEFAULT false)
*   `images` (jsonb) -> Array of Storage WebP URLs

**stolen_vehicles (Security Blacklist)**
*   `reg_number` (text, PK, INDEXED)
*   `reported_by` (uuid, FK -> profiles.id)
*   `report_date` (timestamp)

### D. Real-Time Bargaining Engine
**offers (The Negotiation Wrapper)**
*   `id` (uuid, PK)
*   `vehicle_id` (uuid, FK -> vehicles.id)
*   `buyer_id` (uuid, FK -> profiles.id)
*   `amount` (numeric)
*   `status` (enum: pending, consideration, rejected, sold)

**messages (Websocket Chat History)**
*   `id` (uuid, PK)
*   `offer_id` (uuid, FK -> offers.id)
*   `sender_id` (uuid, FK -> profiles.id)
*   `content` (text)
*   `media_url` (text, NULLABLE)
*   `created_at` (timestamp, INDEXED DESC)

### E. Financial Engine (Daraja & Cash)
**transactions (The Ledger)**
*   `id` (uuid, PK)
*   `user_id` (uuid, FK -> profiles.id)
*   `amount` (numeric)
*   `method` (enum: mpesa, cash)
*   `reference` (text, UNIQUE) -> MpesaReceiptNumber or Cash ID
*   `agent_id` (uuid, FK -> profiles.id, NULLABLE)

**cash_logs (Shift Reconciliation)**
*   `id` (uuid, PK)
*   `agent_id` (uuid, FK -> profiles.id)
*   `opening_bal` (numeric)
*   `closing_bal` (numeric)
*   `handover_to` (uuid, FK -> profiles.id)

### F. Analytics & Growth Hub
**vehicle_views (Traffic Analytics)**
*   `id` (uuid, PK)
*   `vehicle_id` (uuid, FK -> vehicles.id)
*   `viewer_id` (uuid, FK -> profiles.id, NULLABLE)
*   `viewed_at` (timestamp)

**newsletter_subs (Marketing CRM)**
*   `email` (text, PK)
*   `is_verified` (boolean, DEFAULT false)

**college_leads (Institute Waitlist)**
*   `id` (uuid, PK)
*   `user_id` (uuid, FK -> profiles.id)
*   `course_pref` (text)

**garage_jobs (Post-Sale Service)**
*   `id` (uuid, PK)
*   `vehicle_id` (uuid, FK -> vehicles.id)
*   `status` (enum: pending, working, ready)
*   `cost` (numeric)

### G. System Operations
**system_settings (Dynamic Variables)**
*   `key` (text, PK) -> e.g., 'premium_zone_price'
*   `value` (text) -> e.g., '1500'

**support_tickets (Helpdesk)**
*   `id` (uuid, PK)
*   `user_id` (uuid, FK -> profiles.id)
*   `issue_type` (text)
*   `is_resolved` (boolean)

**audit_logs (Security Tracking)**
*   `id` (uuid, PK)
*   `admin_id` (uuid, FK -> profiles.id)
*   `action` (text) -> e.g., 'Manual Check-in Override'
*   `created_at` (timestamp)

---

## PART 2: UI/UX DESIGN SYSTEM & COLOR SPECIFICATIONS

A rigid visual framework mapping the extracted tri-color palette across all 29 Pages, 19 Modals, and core components for maximum outdoor legibility and brand consistency.

### The Official Palette (Extracted Hex Codes)
*   **Carflex Red (#E60000)**: High-octane, aggressive primary action color. Used strictly for "Next Step" buttons, critical alerts, and focal highlights.
*   **Pitch Black (#0A0A0A)**: Deep charcoal/pitch black. Used for high-contrast dark mode backgrounds (Staff/Admin), bold typography, and heavy structural containers.
*   **Stark White (#FFFFFF)**: Pure white. Used for card backgrounds, clean spacing, and text on Black/Red surfaces.

---

## PART 3: THE COMPONENT CHECKLIST (Status & Coverage)

### 1. Pages (29 Total)
| Category | Page Name | Status |
| :--- | :--- | :--- |
| **Public Marketplace** | Landing Page | ✅ Done |
| | Live Bazaar Gallery | ✅ Done |
| | Vehicle Profile | ✅ Done |
| | Training Institute Hub | ✅ Done (Modal Waitlist) |
| | Garage & Service Center | ✅ Done |
| | Import Tracker | ✅ Done |
| **User/Auth** | OTP Login/Register | ✅ Implemented (Phone Filter) |
| | User Dashboard | ✅ Done |
| | Transaction History | ✅ Done |
| | Settings & Security | ✅ Done |
| **Negotiation** | Bargain Inbox | ✅ Done |
| | Real-Time Chat Room | ✅ Done |
| **Vendor Tools** | My Showroom | ✅ Done |
| | Listing Completion Wizard | ✅ Done |
| | Offer Manager | ✅ Done |
| **Ground Staff** | Agent 1 (Gate Check-in) | ✅ Done |
| | Agent 2 (Verification) | ✅ Done |
| | Agent 3 (Exit Validator) | ✅ Done |
| | Staff Shift Summary | ✅ Done |
| **Admin Dashboard** | Global Analytics | ✅ Done |
| | Finance & Reconciliation | ✅ Done |
| | Event Manager | ✅ Done |
| | Battery & Performance Monitor | ✅ Done |
| | Audit Log Explorer | ✅ Done |
| **Support/Legal** | Vendor KB | ✅ Done |
| | Buyer Safety Guide | ✅ Done |
| | Staff Training Portal | ✅ Done |
| | Legal & Terms | ✅ Done |
| | FAQs | ✅ Done |

### 2. Modals (19 Total)
| Category | Modal Name | Status |
| :--- | :--- | :--- |
| **Buyer/Guest** | Make an Offer | ✅ Done |
| | Newsletter Signup | ✅ Done |
| | Bazaar Share Card | ✅ Done |
| **Profile/Financial** | ID Upload | ✅ Done (Agent 2 Page) |
| | Transaction Details | ✅ Done |
| **Bargaining** | Counter-Offer | ✅ Done |
| | Stay/Withdraw Confirmation | ✅ Done |
| | Accept & Mark Sold | ✅ Done |
| **Vendor Ops** | Listing Edit | ✅ Done |
| | Early Exit Survey | ✅ Done |
| | I Am Blocked Alert | ✅ Done |
| **Staff Alerts** | Zonal Mismatch | ✅ Done |
| | Stolen/Blacklist Alert | ✅ Done |
| | Manual Payment Override | ✅ Done |
| **Admin Actions** | Emergency Broadcast | ✅ Done |
| | Manual Refund | ✅ Done |
| | Moderation Panel | ✅ Done |
| **Support** | Live Support Chat | ✅ Done |
| | Report a Bug/Issue | ✅ Done |

---

## PART 4: THE MASTER IMPLEMENTATION PLAN

### Epoch 4: Vendor Command & Listing Mastery (Flows 81-100)
*   Build **My Showroom** and **Listing Completion Wizard**.
*   Implement **WebP Image Compression** and Storage integration.
*   Create **Offer Manager** for sellers to accept/reject bids.

### Epoch 5: Deal Closure & Security Protocols (Flows 101-120)
*   Implement **Accept & Mark Sold** logic with PostgreSQL Triggers.
*   Build **Agent 3 (Exit Validator)** and **Early Exit Survey**.
*   Create **QR JWT Generation** for security exit passes.

### Epoch 6: The Admin Hub & Financial Recon (Flows 121-150)
*   Build all 5 **Admin Dashboard** pages.
*   Implement **Cash Reconciliation** and **Audit Log Explorer**.
*   Finalize **Support & Legal** knowledge base pages.
