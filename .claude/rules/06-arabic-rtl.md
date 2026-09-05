# 06 — Arabic & RTL Design

> These rules are mandatory when relevant. They are not visual templates. The business, audience, content, and page goal always come first.

This file applies whenever a project includes Arabic content or an RTL locale. It extends [01-apple-design-foundations.md](01-apple-design-foundations.md)'s brand-before-imitation principle and the sizing notes in [03-typography-layout-spacing.md](03-typography-layout-spacing.md).

## Arabic-First Design

- Arabic is not a mirrored, translated afterthought bolted onto an LTR design. If Arabic is a primary language for the project, design the layout, hierarchy, and pacing with Arabic as a first-class experience from the start.
- Do not simply flip an LTR design and call it done — verify every pattern in this file against the actual Arabic layout, not just the direction attribute.

## RTL Layout Behavior

- Direction flips the entire layout, not just text alignment: reading order, element order, navigation order, and flow all mirror from right to left.
- Set `dir="rtl"` at the document or root level for Arabic locales, and design the composition as if right is the "start" edge.

## Logical CSS Properties

- Use logical CSS properties exclusively for anything direction-sensitive: `margin-inline-start/end`, `padding-inline-start/end`, `inset-inline-start/end`, `border-inline-start/end`, `text-align: start`/`end`.
- Never hardcode `left`/`right`, `margin-left`/`margin-right`, or `text-align: left`/`right` in shared components that must support both directions — these silently break the moment `dir` flips.
- Flexbox/grid direction should follow the document's writing mode automatically (`row` reverses under `dir="rtl"` by default) — don't fight this with manual `row-reverse` hacks unless there's a specific exception.

## Arabic Typography

- Choose a typeface with genuine, well-designed Arabic glyph support and a comparable weight range to the Latin typeface — don't default to a generic system Arabic fallback font while the Latin type is a considered brand choice.
- Increase line-height and consider a marginally larger base size versus the Latin equivalent (see [03-typography-layout-spacing.md](03-typography-layout-spacing.md)) — Arabic script needs more vertical breathing room to remain legible.
- Never apply negative or tight letter-spacing to Arabic text; it breaks letter connections and can make words unreadable.

## Bidi Handling

- When Arabic and Latin/numeral content mix in the same line (brand names, emails, prices, code), isolate the embedded LTR fragment with `<span dir="ltr">` or the `unicode-bidi: isolate` / `bdi` element so it doesn't visually scramble within the surrounding RTL text.
- Test mixed-content edge cases explicitly: a sentence containing a URL, an email address, or a Latin brand name inside Arabic body copy.

## Navigation

- Primary navigation order mirrors: what reads first (rightmost) in RTL corresponds to what read first (leftmost) in LTR — logo position, menu order, and utility icons (search, cart, account) all flip accordingly.
- Breadcrumbs read right-to-left, with the hierarchy arrow direction flipped to match.

## Icon Mirroring

- Mirror icons that convey directionality or reading order: arrows, chevrons, "next/back" controls, forward/reply icons, progress indicators.
- Do not mirror icons whose meaning is direction-independent or tied to a real-world object: play buttons, clocks, media controls (play still points right by convention in most players — verify per platform norm), checkmarks, brand marks/logos.
- When in doubt for a given icon, check whether its meaning is spatial/directional (mirror) or symbolic/universal (don't mirror).

## Carousels & Sliders

- Carousel/slider advance direction flips under RTL: "next" moves content leaving from the left, entering from the right (the reverse of LTR).
- Navigation dots/arrows for carousels follow the same mirroring rule as general icons above.

## Forms

- Label alignment and input text alignment follow `text-align: start`, which resolves to right in RTL — never hardcode left alignment on form fields for a bilingual project.
- Validation icons/messages (error, success) sit on the logical start/end side consistently with the rest of the RTL layout, not a hardcoded side.
- Placeholder and helper text direction must match the field's content direction, not the surrounding page default, when mixed-language input is expected (e.g., an email field inside an otherwise-Arabic form).

## Numerals

- Decide deliberately per-project whether to use Arabic-Indic numerals (٠١٢٣) or Western Arabic numerals (0123) — both are legitimate depending on the target audience's convention (Gulf vs. Levant vs. North Africa vary) — and apply that choice consistently across the entire site.
- Never mix numeral systems arbitrarily within the same interface; inconsistency here reads as an unfinished translation, not a deliberate design decision.

## CTA Direction

- Primary CTA placement follows the mirrored reading flow: what would be "bottom-right, last thing you reach" in an LTR narrative becomes "bottom-left" in RTL, following the same end-of-flow logic, not a fixed screen position.
- Button internal layout (icon + label order) also mirrors so the icon still reads as leading/trailing correctly relative to the text.

## Mobile Arabic

- Swipe gesture direction for RTL carousels and interactions should match the mirrored logical direction (swipe toward the content's "next," not a hardcoded physical direction).
- Thumb-reachable zones for primary actions on mobile still apply (see [03-typography-layout-spacing.md](03-typography-layout-spacing.md)) — re-verify them against the mirrored layout, since the ergonomically natural zone can shift.

## Accessibility

- Set correct `lang` (e.g., `lang="ar"`) alongside `dir="rtl"` so screen readers use correct pronunciation rules — never rely on `dir` alone.
- For bilingual pages, wrap language-switched fragments with their own `lang` attribute so assistive technology switches voice/pronunciation correctly mid-page.
- If the site offers a language switcher, it must be operable and clearly labeled in both languages, and must not disorient keyboard/screen-reader navigation order when direction changes.
