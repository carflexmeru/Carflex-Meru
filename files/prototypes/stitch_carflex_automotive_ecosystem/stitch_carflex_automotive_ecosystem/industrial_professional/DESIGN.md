---
name: Industrial Professional
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#424752'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#727784'
  outline-variant: '#c2c6d4'
  surface-tint: '#115cb9'
  primary: '#003f87'
  on-primary: '#ffffff'
  primary-container: '#0056b3'
  on-primary-container: '#bbd0ff'
  inverse-primary: '#acc7ff'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fd8b00'
  on-secondary-container: '#603100'
  tertiary: '#004d10'
  on-tertiary: '#ffffff'
  tertiary-container: '#13671f'
  on-tertiary-container: '#91e38b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#acc7ff'
  on-primary-fixed: '#001a40'
  on-primary-fixed-variant: '#004491'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#a3f69c'
  tertiary-fixed-dim: '#88d982'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005312'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  touch-target-min: 48px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is engineered for the "Industrial Professional" aesthetic, specifically tailored for the high-intensity automotive sector in Kenya. The visual language balances rugged durability with digital precision. It prioritizes utility and speed, ensuring that users in outdoor, high-glare environments—such as car lots, repair bays, and bustling marketplaces—can interact with the interface without friction.

The style is a hybrid of **Corporate Modern** and **High-Contrast Bold**. It utilizes heavy linework and solid blocks of color to define structure, avoiding subtle gradients or soft blurs that wash out under sunlight. The emotional response is one of reliability, efficiency, and authoritative performance.

## Colors

The palette is optimized for high-contrast accessibility (WCAG 2.1 AA/AAA) to combat outdoor glare. 

- **Primary (Carflex Blue):** Used for core actions and brand identity.
- **Secondary (Carflex Orange):** Reserved for high-priority alerts, critical CTAs, and industrial highlights.
- **Role-Based Coding:** To provide immediate context in a multi-user ecosystem, the UI adopts specific color accents:
    - **Staff:** Slate and Yellow (utilitarian/caution aesthetic).
    - **Vendors:** Blue (professional/commercial).
    - **Buyers:** Green (growth/trust).
- **Backgrounds:** Use pure white or high-contrast slate-50 to ensure text and touch targets remain crisp.

## Typography

This design system utilizes **Inter** for its exceptional legibility and systematic structure. The type scale is intentionally generous to accommodate users on the move.

- **Headlines:** Set with tight tracking and heavy weights to command attention.
- **Body Text:** Increased line height (1.5–1.6) to prevent eye fatigue during long listing reviews.
- **Labels:** Uppercase bold labels are used for technical data points (e.g., VIN numbers, Engine Specs) to distinguish them from editorial content.

## Layout & Spacing

The layout follows a **Fluid Grid** model with an 8px base unit. 

- **Touch Targets:** A strict minimum of 48x48px for all interactive elements to ensure ease of use for staff wearing work gloves or users on bumpy transit.
- **Rhythm:** Vertical rhythm is established using 24px and 48px increments to separate distinct content blocks.
- **Margins:** Wider mobile margins (20px) prevent accidental triggers and frame the content clearly.

## Elevation & Depth

This design system avoids complex shadows in favor of **Tonal Layers and Bold Borders**. 

- **Surface Levels:** Use light gray backgrounds (#F1F5F9) for the canvas and pure white (#FFFFFF) for cards to create separation.
- **Borders:** 2px solid borders are used for interactive states rather than subtle shadows. This ensures that even in direct sunlight, the boundaries of a button or input field are unmistakable.
- **Depth:** Floating Action Buttons (FABs) utilize a single, high-contrast drop shadow (0px 4px 12px, 20% opacity) to signify they sit above the primary content plane.

## Shapes

The shape language is **Soft (0.25rem)**, reflecting the "Industrial" theme. Sharp enough to feel professional and structural, but slightly softened at the corners to maintain a modern software feel.

- **Primary Elements:** Buttons and Inputs use a 4px (0.25rem) radius.
- **Containers:** Large cards and modals use an 8px (0.5rem) radius.
- **Status Pills:** Use a full "Pill" radius (999px) to contrast against the rectangular structural elements.

## Components

- **High-Contrast Buttons:** Large (min-height 48px), solid fills. Primary actions use Carflex Blue with white text. Critical alerts use Carflex Orange. 
- **Floating Action Buttons (FABs):** Circular (56x56px), positioned at the bottom right. Always use high-contrast icons to represent the most frequent action (e.g., "Add Listing," "Start Inspection").
- **Status Icons:** Heavy stroke-weight icons (2px minimum) paired with semantic background tints. High-saturation green for "Active," yellow for "Pending," and red for "Action Required."
- **Input Fields:** Thick 2px borders that change to Carflex Blue on focus. Labels always sit above the field, never as placeholder-only, to ensure context is never lost.
- **Vehicle Cards:** Standardized units featuring a large image top, bold price highlight in the bottom right, and role-coded header tags (Staff/Vendor/Buyer labels).
- **Tactile Lists:** List items with a minimum height of 64px, featuring chevron-right indicators to signal "drill-down" capability.