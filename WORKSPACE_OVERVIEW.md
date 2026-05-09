# Carflex Marketplace Ecosystem — Complete Workspace Overview

**Project**: Carflex Bazaar v1.0 — A high-trust automotive marketplace platform  
**Tech Stack**: Next.js 16.2.4 | React 19.2.4 | Prisma 6.19.3 | PostgreSQL | Supabase  
**Status**: Production v1.0 with 29 Pages, 19 Modals, 18 Database Tables  
**Date**: May 8, 2026

---

## 1. PROJECT MISSION & ARCHITECTURE

### Core Vision
Carflex is a **real-time automotive marketplace** operating at the Meru Showground in Kenya. It combines:
- **Live Bazaar Operations**: Physical event management with digital integration
- **Real-Time Bargaining Engine**: Buyers and sellers negotiate in real-time via chat
- **Financial Integration**: M-Pesa (Daraja API) and cash payment processing
- **Security & Verification**: Vehicle verification, stolen vehicle blacklist, QR-based exit passes
- **Multi-Role Ecosystem**: Buyers, Vendors, Ground Staff (3 agent types), Admins, Students

### Design System Palette
- **Carflex Red (#E60000)**: Primary action color, alerts, focal highlights
- **Pitch Black (#0A0A0A)**: Dark mode backgrounds, high contrast
- **Stark White (#FFFFFF)**: Card backgrounds, clean spacing, text on dark surfaces

---

## 2. DATABASE SCHEMA (18 Tables)

### A. Identity & Core Users
**`profiles`** — Core user data
- `id` (uuid, PK) → Connects to auth.users
- `phone` (text, UNIQUE, INDEXED)
- `username`, `email`, `name`, `idNumber` (all UNIQUE)
- `role` (enum: admin, staff, vendor, buyer, student)
- `password`, `avatarUrl`, `businessAddress`, `website`
- `onboardingCompleted` (boolean)
- `createdAt`, `updatedAt`

### B. Bazaar & Spatial Operations
**`events`** — Bazaar days/events
- `id`, `name`, `location`, `isActive`, `createdAt`

**`zones`** — Parking/display zones
- `id`, `eventId` (FK), `name`, `capacity`, `occupancy`, `price`

**`bookings`** — Parking tickets
- `id`, `vehicleId` (FK), `zoneId` (FK), `agentId` (FK)
- `paymentStatus` (enum: paid, pending, failed)
- `paymentMethod` (cash, mpesa), `paymentAmount`
- `checkInAt`, `exitAt`

**`exit_passes`** — Security gate logic
- `id`, `bookingId` (FK, UNIQUE), `qrJwtHash` (UNIQUE), `isUsed`

### C. The Vehicle Asset
**`vehicles`** — Core commodity
- `id`, `ownerId` (FK), `organizationId` (FK)
- `regNumber` (UNIQUE, INDEXED), `chassisNumber` (UNIQUE)
- `make`, `model`, `year`, `price` (INDEXED)
- `status` (enum: draft, active, sold, in_garage)
- `isVerified`, `isComplete`, `description`, `features[]`, `images[]`
- `ownershipProofUrl`, `atEvent`, `eventName`, `zoneId` (FK)
- `createdAt`, `updatedAt`

**`raw_listings`** — Gate intake data
- `id`, `originalRegNum`, `ownerPhone`, `ownerIdNumber`
- `make`, `model`, `year`, `gateEntryTime`, `isConverted`

**`organization`** — Fleet/dealer management
- `id`, `name`, `repName`, `repId`, `createdAt`

**`stolen_vehicles`** — Security blacklist
- `regNumber` (PK, INDEXED), `reportedById` (FK), `reportDate`

### D. Real-Time Bargaining Engine
**`offers`** — Negotiation wrapper
- `id`, `vehicleId` (FK), `buyerId` (FK)
- `amount`, `status` (enum: pending, consideration, rejected, sold)
- `createdAt`

**`messages`** — WebSocket chat history
- `id`, `offerId` (FK), `vehicleId` (FK)
- `senderId` (FK), `receiverId` (FK)
- `content`, `mediaUrl`, `createdAt` (INDEXED DESC)

### E. Financial Engine
**`transactions`** — Ledger
- `id`, `userId` (FK), `amount`, `method` (mpesa, cash)
- `reference` (UNIQUE), `agentId` (FK), `createdAt`

**`cash_logs`** — Shift reconciliation
- `id`, `agentId` (FK), `openingBal`, `closingBal`, `handoverTo`

### F. Analytics & Growth Hub
**`vehicle_views`** — Traffic analytics
- `id`, `vehicleId` (FK), `viewerId` (FK), `viewedAt`

**`newsletter_subs`** — Marketing CRM
- `email` (PK), `isVerified`, `createdAt`

**`college_leads`** — Institute waitlist
- `id`, `userId` (FK), `coursePref`, `createdAt`

**`garage_jobs`** — Post-sale service
- `id`, `vehicleId` (FK), `ownerId` (FK)
- `status` (enum: pending, working, ready), `cost`, `createdAt`

### G. System Operations
**`system_settings`** — Dynamic variables
- `key` (PK), `value`, `description`, `updatedAt`

**`support_tickets`** — Helpdesk
- `id`, `userId` (FK), `issueType`, `isResolved`, `createdAt`

**`audit_logs`** — Security tracking
- `id`, `adminId` (FK), `action`, `createdAt`

**`staff_agents`** — Staff credentials
- `id`, `type` (UNIQUE: REGISTRATION_AGENT, GATE_VERIFICATION_AGENT, GROUND_VERIFICATION_AGENT)
- `password`, `name`, `lastLogin`

**`action_logs`** — Event tracking
- `id`, `timestamp`, `actionType`, `agentName`, `description`, `metadata` (JSON)

---

## 3. NAVIGATION & LAYOUT ARCHITECTURE

### 1. Public Top Navigation (Discovery Header)
**Where**: All public marketplace pages (Landing, Bazaar Gallery, Vehicle Profile, Institute Hub, Garage, Import Tracker, Support/Legal)

**UI Specs**:
- Background: #0A0A0A (Pitch Black)
- Text/Icons: #FFFFFF (Stark White)
- Layout: Logo (left) | Nav links (center) | Sign In + Sell Car buttons (right)
- "Sell Car" button: Solid #E60000

**Animations**:
- Hover: 2px #E60000 underline slides left-to-right
- Scroll: #FFFFFF (10% opacity) bottom shadow appears

**Triggers**:
- "Bazaar Gallery" → Live Bazaar Gallery (Page)
- "Institute" → Training Institute Hub (Page)
- "Sign In" → OTP Login (Page/Modal)
- "Sell Car" → Listing Completion Wizard (if logged in) or OTP Login (if not)

### 2. Mobile Bottom Navigation (Field Navigator)
**Where**: Mobile devices for authenticated users (Buyers, Vendors on Dashboard, Inbox, Showroom, Bazaar Gallery)

**UI Specs**:
- Background: #FFFFFF with 2px #0A0A0A top border
- Icons: Inactive #0A0A0A, Active #E60000
- Center FAB: Large #E60000 circle with #FFFFFF QR Scanner icon

**Animations**:
- Tap: Scale 110% bounce, turn #E60000
- Badge Pulse: Unread messages pulse #E60000 dot on Inbox icon

**Connections**:
- Icon 1 (Home) → Live Bazaar Gallery
- Icon 2 (Inbox) → Bargain Inbox
- Center FAB (Scan) → Camera → Vehicle Profile or Transaction Details
- Icon 4 (Showroom/Favorites) → My Showroom (vendors) or Saved Cars (buyers)
- Icon 5 (Profile) → User Dashboard

### 3. Command Sidenav (Admin & Vendor Desktop)
**Where**: Desktop/Tablet for Admin Dashboard and Vendor Tools

**UI Specs**:
- Background: #0A0A0A (full left height)
- Text: #FFFFFF
- Active State: #E60000 background block with bold #FFFFFF text
- Footer: High-risk action zone

**Animations**:
- Slide: Parent categories expand to reveal nested pages
- Hover: Inactive links turn #E60000

**Connections**:
- Top links → 5 Admin Dashboard Pages
- Admin Bottom Button ("Broadcast Alert") → Emergency Broadcast (Modal)
- Vendor Bottom Button ("Exit Bazaar") → Early Exit Survey (Modal)

### 4. Agent Action Bar (Staff Top/Bottom Hybrid)
**Where**: Mobile devices of Ground Staff (Gate Agent, Verification Agent, Exit Agent)

**UI Specs**:
- Top Header: #0A0A0A | Agent Name (left) | Sync Status indicator (right)
- Bottom Action: Full-width #E60000 button with #FFFFFF text

**Animations**:
- Offline Pulse: Sync icon flashes #E60000 if network drops
- Swipe-to-Confirm: High-stakes actions require swipe-right (like phone unlock)

**Connections**:
- Top Menu → Staff Shift Summary or Report Bug
- Bottom Button (Agent 1) → Daraja API Push or Manual Payment Override
- Bottom Button (Agent 2) → OCR camera for ID Upload
- Swipe Button (Agent 3) → Confirm exit or Stolen/Blacklist Alert

### 5. Global Footer (Growth Engine)
**Where**: Bottom of all public marketplace and support/legal pages (hidden on staff/admin/chat)

**UI Specs**:
- Background: #0A0A0A with thick #E60000 top border
- Text: #FFFFFF headers and body
- Newsletter Block: #FFFFFF input + #E60000 "SUBSCRIBE" button

**Animations**:
- Hover: Footer links turn #E60000
- Success: Button morphs to #FFFFFF checkmark

**Connections**:
- Links → Vendor KB, Buyer Safety Guide, Staff Training, Legal, FAQs
- Support Button → Live Support Chat (Modal)
- Subscribe Button → Newsletter Signup (Modal/Toast)

---

## 4. PAGES (29 Total)

### Public Marketplace (6)
1. **Landing Page** (`src/app/page.tsx`) — Hero section with video, stats loop, college enrollment CTA
2. **Live Bazaar Gallery** (`src/app/marketplace/page.tsx`) — Real-time vehicle inventory with filters
3. **Vehicle Profile** (`src/app/vehicles/[id]/page.tsx`) — Detailed car view with images, specs, offers
4. **Training Institute Hub** (`src/app/events/meru-2026/page.tsx`) — College enrollment with waitlist modal
5. **Garage & Service Center** (`src/app/garage/page.tsx`) — Post-sale service booking
6. **Import Tracker** (`src/app/import-tracker/page.tsx`) — Track imported vehicles

### User/Auth (4)
7. **OTP Login/Register** (`src/app/vendor/login/page.tsx`, `src/app/staff/login/page.tsx`) — Phone-based authentication
8. **User Dashboard** (`src/app/dashboard/page.tsx`) — Buyer/vendor profile, stats, quick actions
9. **Transaction History** (`src/app/dashboard/transactions/page.tsx`) — Payment ledger
10. **Settings & Security** (`src/app/dashboard/settings/page.tsx`) — Profile management

### Negotiation (2)
11. **Bargain Inbox** (`src/app/inbox/page.tsx`) — List of active offers/negotiations
12. **Real-Time Chat Room** (`src/app/inbox/[id]/page.tsx`) — WebSocket-powered chat with seller/buyer

### Vendor Tools (3)
13. **My Showroom** (`src/app/showroom/page.tsx`) — Vendor's active listings
14. **Listing Completion Wizard** (`src/app/showroom/complete/page.tsx`) — Multi-step vehicle upload
15. **Offer Manager** (`src/app/showroom/offers/page.tsx`) — Accept/reject buyer offers

### Ground Staff (4)
16. **Agent 1 (Gate Check-in)** (`src/app/gate/check-in/page.tsx`) — Vehicle intake, payment trigger
17. **Agent 2 (Verification)** (`src/app/staff/ground/page.tsx`) — ID upload, vehicle verification
18. **Agent 3 (Exit Validator)** (`src/app/agent/exit/page.tsx`) — QR scan, exit authorization
19. **Staff Shift Summary** (`src/app/staff/shift/page.tsx`) — Daily stats, cash reconciliation

### Admin Dashboard (5)
20. **Global Analytics** (`src/app/admin/page.tsx`) — Real-time KPIs, revenue, vehicle counts
21. **Finance & Reconciliation** (`src/app/admin/finance/page.tsx`) — M-Pesa logs, cash logs, disputes
22. **Event Manager** (`src/app/admin/events/page.tsx`) — Create/edit bazaar events, zones
23. **Battery & Performance Monitor** (`src/app/admin/monitor/page.tsx`) — System health, API latency
24. **Audit Log Explorer** (`src/app/admin/audit/page.tsx`) — Admin actions, security events

### Support/Legal (5)
25. **Vendor KB** (`src/app/support/vendor-kb/page.tsx`) — Seller guides, best practices
26. **Buyer Safety Guide** (`src/app/support/buyer-safety/page.tsx`) — Fraud prevention, inspection tips
27. **Staff Training Portal** (`src/app/support/staff-training/page.tsx`) — Agent onboarding, procedures
28. **Legal & Terms** (`src/app/support/legal/page.tsx`) — T&Cs, privacy policy, disclaimers
29. **FAQs** (`src/app/faq/page.tsx`) — Common questions, troubleshooting

---

## 5. MODALS (19 Total)

### Buyer/Guest (3)
1. **Make an Offer** — Input offer amount, submit bid
2. **Newsletter Signup** — Email capture for marketing
3. **Bazaar Share Card** — Generate shareable vehicle link

### Profile/Financial (2)
4. **ID Upload** — OCR-powered ID verification (Agent 2)
5. **Transaction Details** — Payment receipt, status, refund options

### Bargaining (3)
6. **Counter-Offer** — Seller responds with new price
7. **Stay/Withdraw Confirmation** — Buyer decides to stay or exit negotiation
8. **Accept & Mark Sold** — Finalize deal, generate exit pass

### Vendor Ops (3)
9. **Listing Edit** — Update vehicle details, images, price
10. **Early Exit Survey** — Feedback before leaving bazaar
11. **I Am Blocked Alert** — Vendor flagged for policy violation

### Staff Alerts (3)
12. **Zonal Mismatch** — Vehicle scanned in wrong zone
13. **Stolen/Blacklist Alert** — Vehicle on security blacklist (full-screen red)
14. **Manual Payment Override** — M-Pesa timeout, manual entry fallback

### Admin Actions (3)
15. **Emergency Broadcast** — Send alert to all agents (full-screen red)
16. **Manual Refund** — Process refund for disputed transaction
17. **Moderation Panel** — Flag/suspend user, remove listing

### Support (2)
18. **Live Support Chat** — Real-time helpdesk widget
19. **Report a Bug/Issue** — Error reporting form

---

## 6. PROJECT STRUCTURE

```
carflex/
├── .agents/                          # Agent skills (Supabase, Postgres best practices)
├── .claude/                          # Claude-specific skills
├── .roo/                             # Roo-specific skills
├── .git/                             # Git repository
├── files/                            # Prototypes, assets
├── prisma/
│   ├── schema.prisma                 # Database schema (18 tables)
│   └── seed.js                       # Database seeding script
├── public/                           # Static assets
│   ├── event assets/                 # Bazaar photos/videos
│   ├── car_bazaar_bg.png
│   ├── hero.png
│   ├── logo.png
│   └── ...
├── scratch/                          # Test scripts (Prisma, DB testing)
├── skills/                           # Workspace-level skills
│   ├── supabase/
│   └── supabase-postgres-best-practices/
├── src/
│   ├── app/                          # Next.js 16 app directory
│   │   ├── (public routes)           # Landing, marketplace, support
│   │   ├── admin/                    # Admin dashboard (5 pages)
│   │   ├── agent/                    # Ground staff (exit, verification)
│   │   ├── api/                      # API routes (organized by domain)
│   │   ├── buyer/                    # Buyer dashboard
│   │   ├── dashboard/                # User dashboard
│   │   ├── events/                   # Bazaar events
│   │   ├── gate/                     # Gate check-in
│   │   ├── inbox/                    # Bargain inbox & chat
│   │   ├── marketplace/              # Live gallery
│   │   ├── showroom/                 # Vendor tools
│   │   ├── staff/                    # Staff pages
│   │   ├── support/                  # Support & legal
│   │   ├── vehicles/                 # Vehicle profiles
│   │   ├── vendor/                   # Vendor dashboard
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── layout/                   # Navigation components
│   │   │   ├── PublicHeader.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── CommandSidebar.tsx
│   │   │   ├── GlobalFooter.tsx
│   │   │   ├── AgentLayout.tsx
│   │   │   └── StaffLayout.tsx
│   │   ├── modals/                   # 19 modal components
│   │   ├── cards/                    # Reusable card components
│   │   ├── LayoutWrapper.tsx         # Route-aware layout switcher
│   │   ├── LiveGallery.tsx           # Vehicle gallery component
│   │   └── ...                       # Other modal components
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   └── daraja.ts                 # M-Pesa integration
│   ├── utils/
│   │   └── supabase/                 # Supabase client utilities
│   └── middleware.ts                 # Next.js middleware
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
├── postcss.config.mjs                # PostCSS config
├── eslint.config.mjs                 # ESLint config
├── AGENTS.md                         # Agent rules (Next.js 16 breaking changes)
├── CARFLEX_LAYOUT_ARCHITECTURE.md    # UI/UX design system
├── SYSTEM_INTEGRATION_MATRIX.md      # Full-stack traceability matrix
├── README.md                         # Project overview
└── supabase_schema.sql               # Supabase schema backup
```

---

## 7. KEY TECHNOLOGIES & INTEGRATIONS

### Frontend
- **Next.js 16.2.4** — React framework with App Router
- **React 19.2.4** — UI library
- **Tailwind CSS 4** — Utility-first styling
- **Material Symbols** — Icon library

### Backend
- **Prisma 6.19.3** — ORM for database access
- **PostgreSQL** — Primary database (Supabase)
- **SQLite (better-sqlite3)** — Local development database option

### Authentication & Security
- **Supabase Auth** — Phone-based OTP authentication
- **Supabase SSR** — Server-side rendering support
- **JWT** — Token-based security for exit passes

### Payment Integration
- **Daraja API (M-Pesa)** — Mobile money payment processing
- **STK Push** — Prompt user for M-Pesa PIN

### Development Tools
- **TypeScript 5** — Type safety
- **ESLint 9** — Code linting
- **ts-node** — TypeScript execution
- **dotenv** — Environment variable management

---

## 8. API ROUTE ORGANIZATION

```
/api/
├── admin/                    # Admin operations
│   ├── analytics/
│   ├── audit/
│   └── finance/
├── buyer/                    # Buyer operations
│   ├── liked/
│   └── transactions/
├── college/                  # College enrollment
│   └── waitlist/
├── daraja/                   # M-Pesa integration
│   ├── callback/
│   └── stk-push/
├── dashboard/                # User dashboard
│   ├── stats/
│   └── transactions/
├── events/                   # Event management
│   └── listings/
├── gate/                     # Gate operations
│   ├── check-in/
│   ├── check-in-status/
│   ├── defer-payment/
│   ├── early-exit/
│   ├── exit/
│   ├── fleet-intake/
│   ├── manifest/
│   └── security-check/
├── health/                   # Health check
├── messages/                 # Chat messages
├── mpesa/                    # M-Pesa operations
│   └── stkpush/
├── newsletter/               # Newsletter
│   └── subscribe/
├── offers/                   # Offer management
│   ├── [id]/
│   └── create/
├── staff/                    # Staff operations
│   ├── login/
│   ├── logs/
│   ├── shift/
│   ├── transactions/
│   └── verify-vehicle/
├── vehicles/                 # Vehicle operations
│   ├── [id]/
│   ├── pending/
│   ├── verify/
│   └── route.ts
├── vendor/                   # Vendor operations
│   ├── auth/
│   ├── complete-listing/
│   ├── listings/
│   ├── messages/
│   ├── offers/
│   ├── raw-listings/
│   ├── stats/
│   ├── sync-assets/
│   ├── transactions/
│   └── vehicles/
└── zones/                    # Zone management
```

---

## 9. ENVIRONMENT & CONFIGURATION

### Key Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (Supabase)
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anonymous key
- `DARAJA_CONSUMER_KEY` — M-Pesa API credentials
- `DARAJA_CONSUMER_SECRET` — M-Pesa API credentials
- `DARAJA_SHORTCODE` — M-Pesa business shortcode
- `DARAJA_PASSKEY` — M-Pesa passkey

### Build & Development
- **Dev Server**: `npm run dev` → http://localhost:3000
- **Build**: `npm run build` → Production bundle
- **Start**: `npm start` → Production server
- **Lint**: `npm run lint` → ESLint check
- **DB Seed**: `npm run db:seed` → Populate test data
- **DB Studio**: `npm run db:studio` → Prisma Studio UI

---

## 10. HOW IT WORKS: THE OPERATIONAL FLOW

### 1. Buyer Journey
1. **Discovery** → Landing page → Live Bazaar Gallery
2. **Vehicle Selection** → Click vehicle → Vehicle Profile
3. **Make Offer** → Input amount → Make an Offer (Modal)
4. **Negotiation** → Real-time chat with seller
5. **Payment** → M-Pesa STK Push or manual cash entry
6. **Exit** → QR scan at gate → Exit Pass generated

### 2. Vendor Journey
1. **Onboarding** → OTP login → Vendor dashboard
2. **List Vehicle** → Listing Completion Wizard (multi-step)
3. **Manage Offers** → Offer Manager → Accept/reject bids
4. **Negotiate** → Real-time chat with buyers
5. **Close Deal** → Accept & Mark Sold → Generate exit pass
6. **Exit** → Early Exit Survey → Leave bazaar

### 3. Ground Staff Journey
1. **Agent 1 (Gate)** → Scan vehicle → Check-in → Trigger M-Pesa payment
2. **Agent 2 (Verification)** → Verify ID → Upload documents → Confirm vehicle
3. **Agent 3 (Exit)** → Scan exit QR → Authorize exit → Log transaction
4. **Shift Summary** → End of day → Cash reconciliation → Handover

### 4. Admin Journey
1. **Global Analytics** → Real-time KPIs, revenue, vehicle counts
2. **Finance & Reconciliation** → Review M-Pesa logs, cash logs, disputes
3. **Event Manager** → Create bazaar events, manage zones
4. **Battery & Performance** → Monitor system health, API latency
5. **Audit Log** → Review admin actions, security events

---

## 11. KEY FEATURES & CAPABILITIES

### Real-Time Bargaining
- WebSocket-powered chat between buyers and sellers
- Counter-offer mechanism with status tracking
- Automatic offer expiration and withdrawal

### Payment Processing
- M-Pesa STK Push integration (Daraja API)
- Manual cash entry with agent verification
- Payment status tracking (pending, paid, failed)
- Refund processing and dispute resolution

### Security & Verification
- Phone-based OTP authentication
- Vehicle verification workflow (Agent 2)
- Stolen vehicle blacklist (security check)
- QR-based exit passes with JWT hashing
- Audit logging for all admin actions

### Analytics & Reporting
- Real-time dashboard KPIs
- Vehicle view tracking
- Transaction history and reconciliation
- Staff shift summaries
- Performance monitoring

### Multi-Role Access Control
- **Buyers**: Browse, offer, negotiate, purchase
- **Vendors**: List, manage offers, negotiate, close deals
- **Staff**: Gate check-in, verification, exit validation
- **Admins**: Analytics, finance, events, moderation
- **Students**: College enrollment waitlist

---

## 12. DEVELOPMENT GUIDELINES

### Code Organization
- **Pages**: One page per route in `src/app/`
- **Components**: Reusable UI components in `src/components/`
- **API Routes**: RESTful endpoints in `src/app/api/`
- **Utilities**: Helper functions in `src/lib/` and `src/utils/`
- **Database**: Prisma ORM with schema in `prisma/schema.prisma`

### Styling
- **Tailwind CSS**: Utility-first approach
- **Color Palette**: #E60000 (red), #0A0A0A (black), #FFFFFF (white)
- **Dark Mode**: Default dark theme with `dark` class
- **Responsive**: Mobile-first design with breakpoints

### API Patterns
- **RESTful**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **Error Handling**: Consistent error responses with status codes
- **Authentication**: Supabase Auth with JWT tokens
- **Rate Limiting**: Implement for payment APIs

### Database Patterns
- **Relationships**: Foreign keys with cascading deletes
- **Indexing**: INDEXED on frequently queried columns
- **Timestamps**: `createdAt`, `updatedAt` on all tables
- **Enums**: Use for status fields (draft, active, sold, etc.)

---

## 13. NEXT STEPS & ROADMAP

### Epoch 4: Vendor Command & Listing Mastery (Flows 81-100)
- Build **My Showroom** and **Listing Completion Wizard**
- Implement **WebP Image Compression** and Storage integration
- Create **Offer Manager** for sellers to accept/reject bids

### Epoch 5: Deal Closure & Security Protocols (Flows 101-120)
- Implement **Accept & Mark Sold** logic with PostgreSQL Triggers
- Build **Agent 3 (Exit Validator)** and **Early Exit Survey**
- Create **QR JWT Generation** for security exit passes

### Epoch 6: The Admin Hub & Financial Recon (Flows 121-150)
- Build all 5 **Admin Dashboard** pages
- Implement **Cash Reconciliation** and **Audit Log Explorer**
- Finalize **Support & Legal** knowledge base pages

---

## 14. IMPORTANT NOTES

### Next.js 16 Breaking Changes
⚠️ **This is NOT the Next.js you know.** This version has breaking changes in APIs, conventions, and file structure. Always read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

### Database Configuration
- **Primary**: PostgreSQL (Supabase)
- **Local Dev**: SQLite with better-sqlite3 adapter
- **Prisma**: Configured with both providers in schema

### Authentication
- **Phone-based OTP**: Supabase Auth
- **Staff Agents**: Separate `staff_agents` table with password
- **JWT Tokens**: Used for exit pass security

### Performance Considerations
- **Image Optimization**: WebP compression for vehicle photos
- **Database Indexing**: INDEXED on phone, regNumber, price, createdAt
- **API Caching**: Consider Redis for frequently accessed data
- **Real-Time**: WebSocket for chat and live updates

---

## 15. QUICK REFERENCE

### Common Commands
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio
```

### Key Files
- **Schema**: `prisma/schema.prisma`
- **Landing Page**: `src/app/page.tsx`
- **Layout**: `src/app/layout.tsx`
- **Prisma Client**: `src/lib/prisma.ts`
- **M-Pesa Integration**: `src/lib/daraja.ts`
- **Layout Wrapper**: `src/components/LayoutWrapper.tsx`

### Important Directories
- **Pages**: `src/app/`
- **Components**: `src/components/`
- **API Routes**: `src/app/api/`
- **Database**: `prisma/`
- **Public Assets**: `public/`

---

**Last Updated**: May 8, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
