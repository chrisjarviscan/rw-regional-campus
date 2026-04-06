

## Update Logo to Realized Worth + RW Institute Co-Branding

### What changes

**Navbar logo** — Replace the plain "RW Institute" text with a co-branded lockup:
- "Realized Worth" as the primary/larger text (Hero Navy, bold)
- A subtle 1px vertical divider in Light Grey
- "RW Institute" as the secondary/smaller text (Dark Teal, medium weight, ~85% size)
- On mobile, use a stacked or condensed version to fit

**Footer logo** — Same co-branding treatment but with white/light text variants appropriate for the dark (Hero Navy) background:
- "Realized Worth" in white, bold
- 1px vertical divider at white 40% opacity
- "RW Institute" in Light Teal, slightly smaller

### Files to modify
1. **`src/components/Navbar.tsx`** — Replace the `<a>` logo element with the horizontal co-brand lockup
2. **`src/components/Footer.tsx`** — Replace the footer logo text with the co-brand lockup (light variant)

### Technical details
- Uses the horizontal co-brand arrangement from the uploaded spec (primary mark left, divider center, secondary mark right)
- Divider: 1px wide, 80% of the taller text height, vertically centered
- "Realized Worth" set in Roboto Bold; "RW Institute" in Roboto Medium at ~85% font size
- Responsive: on small screens, reduce spacing and font sizes proportionally

