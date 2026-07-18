---
name: Velocity Dark
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bacbbc'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849587'
  outline-variant: '#3b4a3f'
  surface-tint: '#00e38c'
  primary: '#fafff8'
  on-primary: '#00391f'
  primary-container: '#3dffa3'
  on-primary-container: '#007244'
  inverse-primary: '#006d40'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#fafeff'
  on-tertiary: '#303030'
  tertiary-container: '#e3e0e0'
  on-tertiary-container: '#646363'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#55ffa8'
  primary-fixed-dim: '#00e38c'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#00522f'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system is built for a high-performance mobility platform. The personality is **futuristic, premium, and hyper-efficient**, mirroring the low-poly automotive aesthetics of the brand's identity. 

The visual style is a fusion of **Corporate Modern** structure with **Glassmorphism** and **High-Contrast Neon** accents. It leverages deep obsidian surfaces to create a sense of infinite depth, allowing the vibrant mint accents to serve as high-visibility beacons for user action. The interface should feel fast—utilizing sharp transitions, clear paths, and a "cockpit" feel that empowers the user to move from point A to B with absolute confidence.

**Key Principles:**
- **Kinetic Energy:** Use subtle glows and gradients to imply motion and speed.
- **Precision:** High-contrast borders and geometric typography ensure readability at a glance.
- **Atmospheric Depth:** Layered translucent surfaces create a sophisticated, multi-dimensional environment.

## Colors

The palette is rooted in deep blacks and charcoal tones to minimize eye strain and maximize the impact of the primary accent.

- **Primary (#3DFFA3):** "Hyper Mint" — Reserved exclusively for primary actions, success states, and active navigation indicators. 
- **Surface (Background #0F0F0F):** A deep, true charcoal that serves as the canvas.
- **Container (#1A1A1A):** Used for cards and elevated sections to create separation from the background.
- **Stroke (#2D2D2D):** A subtle gray for borders that defines shapes without breaking the dark-mode immersion.
- **Accent Red (#FF4D4D):** Inspired by the taillight in the logo, used sparingly for errors and cancellations.

## Typography

The typography system pairs **Sora** for headlines with **Inter** for functional text. Sora’s geometric structure and wide stance give it an automotive, technical feel suitable for large displays and brand moments. Inter provides the necessary utilitarian clarity for ride details, pricing, and maps.

- **Headlines:** Use Sora for all titles and key data points (e.g., ETA or Price).
- **Body:** Use Inter for all descriptive text.
- **Labels:** Small caps or bold Inter should be used for metadata and secondary labels to maintain a structured, "heads-up display" (HUD) aesthetic.

## Layout & Spacing

This design system utilizes a **Fluid Grid** model with a heavy emphasis on "Safe Zones" to ensure touch targets are easily accessible while driving or on the move.

- **Desktop:** 12-column grid with wide 64px margins to center the focus on the booking experience.
- **Mobile:** 4-column grid with 16px margins. Primary action buttons should be pinned to the bottom of the viewport for thumb-reachability.
- **Vertical Rhythm:** A strict 8px baseline grid ensures consistent alignment of text and icon assets.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

1.  **Level 0 (Base):** #0F0F0F. The main application background.
2.  **Level 1 (Card):** #1A1A1A with a 1px border of #2D2D2D.
3.  **Level 2 (Glass):** Semi-transparent #1A1A1A (80% opacity) with a `backdrop-filter: blur(12px)`. Used for navigation bars and floating action sheets.
4.  **Level 3 (Interactive):** The primary color (#3DFFA3) uses an ambient outer glow (`box-shadow: 0 0 20px rgba(61, 255, 163, 0.3)`) to simulate a neon light source.

## Shapes

The shape language is "Speed-Rounded"—combining the aggressive lean of the logo's geometry with modern, user-friendly radii. 

- **Containers & Cards:** Use `rounded-xl` (24px) to create a premium, oversized feel.
- **Buttons:** Use `rounded-lg` (16px) for standard actions.
- **Input Fields:** Consistent with buttons at 16px.
- **Visual Accents:** Incorporate 45-degree chamfered edges on decorative elements to mirror the low-poly aesthetic of the vehicle in the brand logo.

## Components

### Buttons
- **Primary:** Background #3DFFA3, Text #0F0F0F (Bold). Feature a subtle neon glow.
- **Secondary:** Transparent background, 1px border of #3DFFA3, Text #3DFFA3.
- **Ghost:** Transparent background, Text White (60% opacity).

### Cards
- Standard cards use #1A1A1A background with 24px corner radius.
- "Live" or "Active" cards (e.g., Trip in Progress) should use a glassmorphic blur with a thin #3DFFA3 border.

### Input Fields
- Dark backgrounds (#0A0A0A) with #2D2D2D borders. 
- On focus, the border transitions to #3DFFA3 with a faint inner glow.

### Chips & Badges
- Used for car categories (e.g., "Luxury," "Economy"). 
- Pill-shaped with low-opacity fills of the primary color and high-contrast text.

### Progress Indicators
- Linear bars use a gradient from #0F0F0F to #3DFFA3 to simulate a speedometer or "filling" energy.