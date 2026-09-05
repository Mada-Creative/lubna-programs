# 03 — Typography, Layout & Spacing

> These rules are mandatory when relevant. They are not visual templates. The business, audience, content, and page goal always come first.

This file defines the concrete system that supports the hierarchy and pacing principles in [01-apple-design-foundations.md](01-apple-design-foundations.md) and [02-apple-web-patterns.md](02-apple-web-patterns.md). For Arabic-script typography specifics, see [06-arabic-rtl.md](06-arabic-rtl.md); this file covers the shared sizing/spacing mechanics that apply regardless of script.

## Typography Hierarchy

- Use a small, deliberate type scale — typically 4–6 sizes doing all the work of the page. More sizes than that signals an undecided hierarchy.
- Weight does more hierarchy work than size. Prefer 2–3 weights (e.g., regular, medium, semibold) used consistently by role, not arbitrarily per section.
- Headline, subhead, and body must be visually distinguishable at a glance without reading the words.
- Choose typefaces (and pair them, if pairing) based on the brand identity established in the visual-concept step — never default to a system-UI look-alike purely because it resembles Apple's own typography.

## Clamp-Based Fluid Sizing

- Use `clamp(min, preferred, max)` for headline and display sizes so type scales smoothly between breakpoints instead of jumping at fixed steps.
- Structure: `clamp(minimum-readable-size, viewport-relative-value, maximum-intended-size)`. The viewport-relative middle value (e.g., `4vw` or a `vw`+`rem` mix) drives the fluid behavior; the min/max are hard content-driven limits, not arbitrary.
- Body text can use fluid sizing too, but with a much narrower min/max range — body copy should not visibly change size across common viewports.
- Never let clamp() produce oversized type on ultra-wide monitors or illegibly small type on narrow phones — always set real max/min bounds, tested at both extremes.

## Line-Height

- Large display/headline type: tighter line-height (roughly 1.0–1.15) — big type needs less line spacing to read as a unit.
- Body copy: looser line-height (roughly 1.4–1.6) for comfortable reading, more toward 1.6+ for longer-form text.
- Line-height must be re-checked whenever font size changes via clamp() — a value tuned for the max size may be wrong at the min size.

## Line Length

- Body copy measure target: roughly 45–75 characters per line (≈ `60ch`–`75ch` as a practical `max-width`).
- Headlines can break this rule deliberately for impact, but body paragraphs should not run edge-to-edge on wide containers.
- Constrain measure with `max-width` on the text element itself, not by fighting the outer grid.

## Spacing System

- Use a single base spacing unit and a consistent multiple/scale from it (e.g., 4px or 8px base) for all margins, padding, and gaps. No arbitrary one-off pixel values.
- Section-level spacing (the gap between major page sections) should be visibly larger than component-level spacing, which should be larger than element-level spacing — three distinct tiers, not a flat scale used interchangeably.
- Generous spacing is a deliberate hierarchy and pacing tool (see whitespace-as-pacing in [02-apple-web-patterns.md](02-apple-web-patterns.md)), not leftover space.

## Containers

- Define a small number of container widths tied to content role (e.g., narrow reading container, standard content container, wide/full-bleed container) — not one width reused for everything.
- Gutters (side padding) scale with viewport but stay consistent within a breakpoint across all sections.

## Grids

- Use a real grid (12-column or a project-appropriate custom grid) for alignment — elements should snap to a shared structure, even in visually asymmetric layouts.
- Grid discipline is what makes asymmetry look intentional instead of accidental.

## Asymmetry

- Purposeful imbalance (off-center focal points, unequal column splits, elements that break the grid at a deliberate edge) is a valid and often stronger choice than default centered/symmetric layouts.
- Asymmetry must still resolve visually — an off-grid element should align with something else on the page, not float arbitrarily.
- Do not default to centered-everything just because it's safe; do not default to asymmetry just because it looks "designed" — the composition decision comes from the visual-concept step, not habit.

## Responsive Layout

- Design breakpoints around where the content naturally breaks (where line length, image aspect, or grid columns stop working), not only at stock device widths.
- Responsive behavior means content reflows and re-prioritizes per viewport (what's visible, what's stacked, what's hidden) — not just uniform scaling of a fixed layout.
- Test the actual narrative order on mobile: the story must still make sense read top-to-bottom at a single column.

## Mobile Spacing

- Reduce spacing scale proportionally on mobile, but keep it generous relative to the smaller viewport — cramped mobile spacing is a common tell of unfinished responsive work (see [08-design-audit-quality-gate.md](08-design-audit-quality-gate.md) mobile audit).
- Respect thumb-reachable zones for primary actions; don't place the sole CTA where it's awkward to reach one-handed.

## Arabic Considerations (sizing/layout only)

- Arabic script generally needs slightly larger line-height than the Latin equivalent at the same size, and benefits from marginally larger body sizes for equivalent legibility — never smaller.
- Letter-spacing should never be reduced (never negative tracking) on Arabic text; tight tracking breaks letterform connections.
- All other RTL/bidi/mirroring rules live in [06-arabic-rtl.md](06-arabic-rtl.md) — this section only covers the type-metric adjustments needed within this file's system.
