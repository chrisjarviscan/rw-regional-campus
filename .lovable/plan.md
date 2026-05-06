## Goal

Replace the current 8-slide generic deck with a brand-faithful 13-slide business case (modeled on the Chase Bank reference you provided) and emit **both** a `.pptx` and a self-contained `.html` file the user can download immediately. Keep the citation links live.

## Brand corrections (from the design system zip)

The current edge function uses approximate hex values. Replace with the canonical RW tokens from `colors_and_type.css`:

| Token | Current | Correct |
|---|---|---|
| Hero Orange | `EF6135` | `EC5C2A` |
| Hero Navy | `0B3552` | `0A3454` |
| Charcoal (heads) | — | `3C3F44` |
| Dark Teal (links) | `4A89A2` | `4491A9` |
| Light Teal | `A2C1CD` | `7FB5C2` |
| Aqua (ring) | — | `B8D8DC` |
| Burgundy (data) | — | `981C20` |
| Mustard (warm) | — | `F59328` |
| Soft bg | `F8F4EE` | `F6F7F8` |

Typography: Roboto (300/400/500/700/900) for body+heads; Roboto Condensed for chart labels and eyebrow text. RW logo white-on-navy for cover/closing, orange-on-white for content footers. Strict ban on pure `#000000`.

## Deck structure (13 slides — mirrors Chase reference)

1. **Cover** — full-bleed navy, orange accent bar, white RW logo, "BUSINESS CASE / Regional Campus Series", company name, presenter, date.
2. **Where {Company} is now** — research-driven situation read, eyebrow + long-form paragraph, aqua sidebar pull-quote.
3. **Why most volunteer programs produce activity, not change** — *diagram*: horizontal flow `RECRUIT → BRIEF (missing) → EXPERIENCE → DEBRIEF (missing) → RETURN`, with the two "missing" nodes rendered in burgundy with dashed outline. Three explanation columns under it (Before / During / After). Footnote chips [1][2][3].
4. **Why immersive learning changes practice** — 4-card grid (Practice / Disorienting dilemma / 40-min debrief / Cohort identity) with numbered orange circle motif.
5. **What trained champions do differently** — three orange-numbered rows with nonprofit photo thumbnails on the right (using existing `RevBest` photos from project).
6. **What changes for employee / company / community** — 3-column card grid with icons in aqua circles.
7. **From a small group to a shift in how {Company} volunteers** — *chart*: stacked bar visualizing "untrained vs trained champion ripple" across 6/12/18-pack tiers.
8. **The campus** — 2-day agenda timeline (horizontal track with morning/afternoon blocks per day) — pulled from `AgendaSection.tsx`.
9. **The credential** — two-stage card layout (Stage 1 / Stage 2 optional), orange and navy variants, badge motif.
10. **Investment** — pricing table, all four tiers, orange highlight on the seat count matching their `seats_requested`. "Includes" footer in muted bar. Campus city/date pulled from selection.
11. **What {Company} gets back** — 6-cell grid (2×3) of value props, alternating navy/teal accents.
12. **Next steps** — 3-step orange-numbered sequence with the right contact (`nichole@realizedworth.com`) and URL.
13. **References** — full citation list with hyperlinks to DOIs, Roboto Condensed, two-column.

All slides carry a footer strip: `RW Institute · Regional Campus Series` left, slide # right, thin orange rule.

## AI tailoring (Lovable AI / `google/gemini-2.5-pro`)

Expand the structured-output tool from 9 fields to ~18 to cover slides 2, 5, 7, 11 personalization. Audience-role conditioning rules stay (CFO ↔ cost/risk; CHRO ↔ talent; CSR ↔ reporting depth). Citation footnote indices are fixed and rendered from a constant table — never hallucinated.

## HTML output (the new piece)

A second renderer in the same edge function builds a self-contained `.html` (single file, inline CSS, base64 fonts/logos) with **dynamic** elements the PPTX can't do:

- Animated reveal on scroll (IntersectionObserver, fade+rise).
- The slide-3 flow diagram as inline SVG with the "missing" nodes pulsing.
- Slide-7 ripple visualization as a live SVG bar chart.
- Pricing table row highlighted on hover; selected seat tier pre-highlighted.
- Citations as clickable footnotes that smooth-scroll to the references section.
- Print stylesheet so the HTML prints cleanly to PDF if the reader prefers.

Both files are returned in one response: `{ filename_pptx, base64_pptx, filename_html, base64_html }`. The frontend (`public/business-case/app.js`) triggers two downloads back-to-back and shows both filenames in the success state.

## Files changed

- `supabase/functions/generate-deck/index.ts` — replace palette constants, expand structured-output schema, build all 13 PPTX slides, add HTML renderer, return both artifacts.
- `public/business-case/app.js` — handle dual download, update success copy ("Your deck is ready — PowerPoint and HTML versions downloaded").
- `public/business-case/index.html` + `styles.css` — minor copy update on step 7 ("Generate & download deck (PPTX + HTML)") and the done step.
- No changes to React landing page, routing, or DB.

## Out of scope

- Email delivery (already removed; downloads only, per your earlier instruction).
- Editing the public landing page beyond what's already shipped.
- Storing generated decks server-side.

## Confirm before I build

The plan assumes the citation list and slide order should match the Chase reference 1:1 (only company-specific copy varies). If you want a shorter variant (e.g., drop slide 8 agenda or slide 13 references for a 10-slide version), say so and I'll trim.
