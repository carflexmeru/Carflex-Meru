# CARFLEX LAYOUT & NAVIGATION ARCHITECTURE

**Design System Palette**: Carflex Red (#E60000), Pitch Black (#0A0A0A), Stark White (#FFFFFF)

This document defines the structural UI components (Navbars, Sidebars, Footers) that wrap the 29 Pages and trigger the 19 Modals within the Carflex Ecosystem.

---

## 1. Public Top Navigation (The Discovery Header)

**Where it appears**: All Public Marketplace pages (Landing Page, Live Bazaar Gallery, Vehicle Profile, Training Institute Hub, Garage & Service Center, Import Tracker) and Support/Legal pages.

### UI Specifications:
*   **Background**: Solid #0A0A0A (Pitch Black) to frame the bright outdoor photos.
*   **Text/Icons**: #FFFFFF (Stark White) for high contrast.
*   **Layout**: Left: Carflex Logo (#E60000 accent). Center: Desktop navigation links. Right: "Sign In" button (Outlined #FFFFFF) and "Sell Car" button (Solid #E60000).
*   **Behavior**: "Sticky" header that stays at the top as the user scrolls the gallery.

### Animations:
*   **Hover**: When a user hovers over a center link, a 2px #E60000 line slides in from left to right underneath the text.
*   **Scroll**: The background gains a slight #FFFFFF (10% opacity) bottom shadow when the user scrolls past the hero section to separate it from the content.

### Connections & Triggers:
*   "Bazaar Gallery" -> Opens Live Bazaar Gallery (Page).
*   "Institute" -> Opens Training Institute Hub (Page).
*   "Sign In" -> Triggers the OTP Login (Page/Modal overlay).
*   "Sell Car" -> If logged in, opens Listing Completion Wizard (Page). If logged out, triggers OTP Login.

**Justification**: The dark header acts as a cinematic frame for the high-resolution car images. The bright #E60000 "Sell Car" button draws immediate attention, converting passive viewers into revenue-generating vendors.

---

## 2. Mobile Bottom Navigation (The Field Navigator)

**Where it appears**: Visible strictly on Mobile Devices for authenticated users navigating the field (Buyers and Vendors on the User Dashboard, Bargain Inbox, My Showroom, and Live Bazaar Gallery).

### UI Specifications:
*   **Background**: Solid #FFFFFF with a harsh 2px #0A0A0A top border.
*   **Icons**: Inactive tabs are #0A0A0A. The active tab is #E60000.
*   **Center FAB (Floating Action Button)**: A large, raised circle overlapping the top border. Background #E60000 with a #FFFFFF QR Scanner icon.

### Animations:
*   **Tap State**: When an icon is tapped, it scales up to 110% (bounce effect) and turns #E60000.
*   **Badge Pulse**: If the user has a new message, an unread badge (a small #E60000 dot) pulses gently on the "Inbox" icon.

### Connections & Triggers:
*   **Icon 1 (Home)** -> Opens Live Bazaar Gallery (Page).
*   **Icon 2 (Inbox)** -> Opens Bargain Inbox (Page).
*   **Center FAB (Scan)** -> Instantly opens the device camera. If they scan a car, it opens Vehicle Profile (Page). If they scan a ticket, it routes to Transaction Details (Modal).
*   **Icon 4 (Showroom/Favorites)** -> Opens My Showroom (Page) (for vendors) or Saved Cars (for buyers).
*   **Icon 5 (Profile)** -> Opens User Dashboard (Page).

**Justification**: At the Meru Showground, 90% of users are walking around holding their phones in one hand. A bottom navigation bar ensures all critical actions (especially the central QR Scanner) are easily reachable by the thumb without stretching.

---

## 3. The Command Sidenav (Admin & Vendor Desktop)

**Where it appears**: Desktop and Tablet views for the Admin Dashboard (Global Analytics, Finance & Reconciliation, Event Manager, Battery & Performance Monitor, Audit Log Explorer) and Vendor Tools.

### UI Specifications:
*   **Background**: Solid #0A0A0A spanning the full left height of the screen.
*   **Text**: #FFFFFF.
*   **Active State**: The active menu item gets a solid #E60000 background block with bold #FFFFFF text.
*   **Footer Area (Bottom of Sidenav)**: A high-risk action zone.

### Animations:
*   **Slide Transition**: Clicking a parent category (e.g., "Finance") smoothly slides down to reveal nested pages (e.g., "Reconciliation", "Transactions").
*   **Hover**: Inactive links turn #E60000 on hover.

### Connections & Triggers:
*   Top links map directly to the 5 Admin Dashboard Pages.
*   **Admin Sidenav Bottom Button** -> "Broadcast Alert". Triggers the Emergency Broadcast (Modal) (turns the screen Red).
*   **Vendor Sidenav Bottom Button** -> "Exit Bazaar". Triggers the Early Exit Survey (Modal) to generate their Exit QR.

**Justification**: Data-dense environments require vertical space for tables and charts. The #0A0A0A dark mode sidebar reduces eye strain for Admins staring at screens in the control tent all day, and provides a clear visual hierarchy.

---

## 4. The Agent Action Bar (Staff Top/Bottom Hybrid)

**Where it appears**: Strictly on the mobile devices of Ground Staff (Agent 1 Gate, Agent 2 Verification, Agent 3 Exit).

### UI Specifications:
*   **Top Header**: Pitch Black #0A0A0A. Left side: Agent Name. Right side: A vital "Sync Status" indicator (Green dot for Online, #E60000 dot for Offline).
*   **Bottom Action Area**: A massive, full-width button fixed to the bottom of the screen. Solid #E60000 with bold #FFFFFF text (e.g., "TRIGGER M-PESA" or "AUTHORIZE EXIT").

### Animations:
*   **Offline Pulse**: If the network drops, the sync icon flashes #E60000 continuously to warn the agent they are caching data locally.
*   **Swipe-to-Confirm**: For high-stakes actions (like Agent 3's "Authorize Exit"), the button requires a swipe-right animation (like unlocking a phone) rather than a simple tap.

### Connections & Triggers:
*   **Top Header Menu** -> Opens Staff Shift Summary (Page) or Report a Bug/Issue (Modal).
*   **Bottom Button (Agent 1)** -> Triggers Daraja API Push. On M-Pesa timeout, triggers Manual Payment Override (Modal).
*   **Bottom Button (Agent 2)** -> Triggers OCR camera for ID Upload (Modal).
*   **Swipe Button (Agent 3)** -> Confirms exit. If a stolen plate is scanned, the whole screen converts to the Stolen/Blacklist Alert (Modal).

**Justification**: Agents are in the hot sun and their batteries drain fast. The massive #0A0A0A backgrounds save OLED battery life. The massive #E60000 buttons prevent "fat-finger" misclicks. The "Swipe-to-Confirm" animation prevents an agent from accidentally authorizing a car to leave the gate if they bump their screen.

---

## 5. The Global Footer (The Growth Engine)

**Where it appears**: At the bottom of all Public Marketplace and Support/Legal pages. (Hidden on Staff, Admin, and Chat pages to save space).

### UI Specifications:
*   **Background**: Solid #0A0A0A with a thick #E60000 top border separating it from the page content.
*   **Text**: #FFFFFF headers and body text.
*   **Newsletter Block**: A highly visible #FFFFFF input field with a solid #E60000 "SUBSCRIBE" button.

### Animations:
*   **Hover Links**: Standard footer links turn #E60000 when hovered over by a mouse.
*   **Success State**: When the newsletter button is clicked, the #E60000 button morphs into a #FFFFFF checkmark briefly to confirm submission.

### Connections & Triggers:
*   Links map to: Vendor KB, Buyer Safety Guide, Staff Training Portal, Legal & Terms, FAQs (Pages).
*   **Support Button** -> Triggers the Live Support Chat (Modal) widget.
*   **Subscribe Button** -> Sends API request and triggers the Newsletter Signup (Modal/Toast) confirmation.

**Justification**: The footer acts as the ultimate "safety net." If a user scrolls to the bottom of the gallery without finding a car, the Newsletter block (in stark contrast to the black background) captures their email for the next month's bazaar, ensuring Carflex's marketing list grows every day.
