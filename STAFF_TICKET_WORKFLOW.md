# Carflex Staff - Ticket Generation Workflow

## Quick Start Guide for Registration Officers

---

## Step 1: Access Staff Terminal

### From Landing Page
1. Go to **carflex.com** (or your deployment URL)
2. Look for the **"STAFF TERMINAL"** button in the hero section
3. Click the button with the terminal icon
4. You'll be redirected to `/staff/login`

### From Direct URL
- Navigate directly to: `/staff/login`

---

## Step 2: Login to Staff Terminal

1. **Select Your Role**:
   - REGISTRATION_AGENT (for vehicle registration)
   - GATE_VERIFICATION_AGENT (for gate verification)
   - GROUND_VERIFICATION_AGENT (for ground verification)
   - EXIT_COMMAND_AGENT (for exit management)

2. **Enter Your Password**:
   - Type your access code
   - Click the eye icon to show/hide password

3. **Click "INITIATE ACCESS"**:
   - You'll be logged in and redirected to your dashboard

---

## Step 3: Navigate to Waitlist

### For Registration Officers:
1. After login, you'll see the **REGISTRATION VAULT** dashboard
2. Click on **"OPERATIONAL WAITLIST"** in the navigation
3. You'll see all pending vehicles awaiting approval

---

## Step 4: Approve Vehicle

1. **Find the vehicle** in the waitlist table
2. **Review vehicle details**:
   - Registration number (plate)
   - Make, model, year
   - Owner/Organization name
   - Assigned zone

3. **Click "AUTHORIZE" button**:
   - Vehicle status changes to "active"
   - Vehicle is now approved for marketplace

---

## Step 5: Generate Ticket (NEW!)

### After Approving a Vehicle:

1. **Click "TICKET" button** (next to AUTHORIZE button)
   - A modal dialog will open
   - Shows vehicle details
   - Displays "GENERATE TICKET" button

2. **Click "GENERATE TICKET"**:
   - System generates unique ticket ID
   - QR code is created
   - Ticket is stored in database

3. **Ticket Details Displayed**:
   - Ticket ID (e.g., TKT-1715245678-ABC123XYZ)
   - Vehicle registration number
   - Vehicle make, model, year
   - Owner name and contact
   - Zone assignment
   - QR code image

---

## Step 6: Download or Print Ticket

### Option A: Download QR Code
1. Click **"DOWNLOAD QR"** button
2. QR code image (PNG) is downloaded to your computer
3. Use for digital verification or email

### Option B: Print Ticket
1. Click **"PRINT TICKET"** button
2. Print dialog opens automatically
3. Professional ticket layout with:
   - Carflex branding
   - Ticket ID (large, bold)
   - QR code
   - Vehicle details
   - Owner information
   - Zone assignment
   - Issue timestamp

4. **Print Options**:
   - Print to physical printer
   - Save as PDF
   - Print to file

---

## Ticket Information

### What's on the Ticket?

```
┌─────────────────────────────────────┐
│          CARFLEX                    │
│    Registration Ticket              │
├─────────────────────────────────────┤
│                                     │
│  TKT-1715245678-ABC123XYZ          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │    [QR CODE IMAGE]          │   │
│  │                             │   │
│  │  Scan for verification      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Registration:  KCA 123 AB          │
│  Vehicle:       2024 Toyota Camry   │
│  Owner:         John Doe            │
│  Contact:       +254 712 345 678    │
│  Zone:          Zone A              │
│  Status:        ACTIVE              │
│                                     │
│  This ticket grants access to the   │
│  Carflex marketplace                │
│                                     │
│  Issued: 2026-05-09 10:30:45        │
└─────────────────────────────────────┘
```

### QR Code Contains:
- Ticket ID
- Vehicle ID
- Registration number
- Timestamp

---

## Common Tasks

### Task 1: Generate Multiple Tickets
1. Approve first vehicle → Generate ticket → Download/Print
2. Approve second vehicle → Generate ticket → Download/Print
3. Repeat for all vehicles

### Task 2: Email Ticket to Owner
1. Generate ticket
2. Download QR code
3. Attach to email
4. Send to vehicle owner

### Task 3: Print Batch of Tickets
1. Generate ticket for each vehicle
2. Click "PRINT TICKET" for each
3. Print all at once from print queue

### Task 4: Digital Verification
1. Generate ticket
2. Download QR code
3. Share digitally with verification team
4. Team scans QR code for verification

---

## Troubleshooting

### Issue: "TICKET" button not showing
- **Solution**: Make sure you clicked "AUTHORIZE" first
- Tickets can only be generated for approved vehicles

### Issue: QR code not displaying
- **Solution**: Check internet connection
- QR codes are generated via external API
- Refresh the page and try again

### Issue: Print dialog not opening
- **Solution**: Check browser pop-up settings
- Allow pop-ups for this website
- Try a different browser

### Issue: Ticket ID not generating
- **Solution**: Refresh the page
- Try generating again
- Contact support if issue persists

---

## Tips & Best Practices

### ✅ DO:
- Generate tickets immediately after approval
- Print tickets for physical records
- Download QR codes for digital sharing
- Keep ticket IDs for audit trail
- Verify vehicle details before generating

### ❌ DON'T:
- Generate multiple tickets for same vehicle
- Share ticket IDs publicly
- Lose printed tickets
- Forget to approve before generating ticket
- Use expired tickets

---

## Ticket Lifecycle

```
Vehicle Registered (Draft)
        ↓
Vehicle Approved (Active)
        ↓
Ticket Generated
        ↓
Ticket Printed/Downloaded
        ↓
Ticket Used for Verification
        ↓
Ticket Marked as Used
```

---

## Support

### Need Help?
- **Email**: support@carflex.com
- **Phone**: +254 XXX XXX XXX
- **Chat**: Available in dashboard
- **FAQ**: See support section

### Report Issues
- Click "Report Issue" in ticket modal
- Describe the problem
- Include ticket ID if applicable
- Support team will respond within 2 hours

---

## FAQ

**Q: Can I generate multiple tickets for one vehicle?**
A: Yes, but each ticket will have a unique ID. Only the latest ticket is considered active.

**Q: How long are tickets valid?**
A: Tickets are valid indefinitely unless marked as expired by admin.

**Q: Can I edit a ticket after generation?**
A: No, tickets are immutable. Generate a new ticket if changes needed.

**Q: What if I lose a printed ticket?**
A: You can regenerate it using the ticket ID. Contact support with the ID.

**Q: Can vehicle owners access their tickets?**
A: Not yet, but this feature is coming soon.

**Q: Are tickets transferable?**
A: No, tickets are tied to specific vehicles and cannot be transferred.

---

## Keyboard Shortcuts

- `Tab` - Navigate between buttons
- `Enter` - Click focused button
- `Esc` - Close modal
- `Ctrl+P` - Open print dialog (when on print page)

---

## Performance Notes

- Ticket generation: < 100ms
- QR code generation: < 500ms
- Print page load: < 1s
- Download QR: < 2s

---

## Security Notes

- Ticket IDs are unique and cryptographically random
- QR codes contain only non-sensitive data
- All tickets logged in audit trail
- Tickets cannot be forged (database verified)
- Print pages are secure and not cached

---

**Last Updated**: May 9, 2026  
**Version**: 1.0  
**Status**: Active
