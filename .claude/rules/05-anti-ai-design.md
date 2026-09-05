# 05 — Anti-AI Design Rules

> These rules are mandatory when relevant. They are not visual templates. The business, audience, content, and page goal always come first.

This file is the explicit negative-space checklist behind CLAUDE.md's instruction to "never behave like a generic AI website generator." Every pattern below is banned as a *default* — not because the technique can never be used, but because reaching for it automatically is exactly how generic, AI-generated-looking sites happen. If a pattern below is ever used, it must be justified by the specific business, not convenience.

## Card Hell

- Do not default to a grid of identical cards (icon + title + one-line description), especially not in sets of three or four, as a stand-in for real content structure.
- If content is genuinely a list of comparable items, it may use a card-like structure — but each item should be visually and informationally distinct where the content is distinct, not templated identically regardless of what it says.

## Generic SaaS Layouts

- Avoid the reflexive formula: hero → logo strip → three-feature grid → testimonial carousel → pricing table → final CTA, applied regardless of the business.
- This formula is banned as a *default template*, not because sections like pricing or testimonials can't exist — they must be structured around this specific product's real narrative (see [02-apple-web-patterns.md](02-apple-web-patterns.md)), not assembled from a generic stack.
- See [07-page-type-playbooks.md](07-page-type-playbooks.md) for how to build a real SaaS narrative instead of the default.

## Fake Statistics

- Never invent numbers, percentages, or metrics ("99% satisfaction," "10x faster," "500+ happy clients") that are not real, sourced data from the business.
- If real stats exist, present them plainly with their source. If they don't exist, don't manufacture the appearance of proof — use real qualitative proof instead (actual work, actual process, actual specificity).

## Fake Testimonials

- Never write placeholder or invented customer quotes, names, or avatars.
- If real testimonials aren't available yet, omit the section entirely rather than fill it with generic-sounding fabricated praise — a missing section is honest; a fake one damages trust and reads as templated.

## Gradient Abuse

- Do not default to decorative mesh/blob gradients (the purple-to-blue or pink-to-orange abstract background) as a filler visual when there's no real content to show.
- Gradients may be used deliberately as part of an established brand color system or for genuine functional purpose (e.g., legibility scrim over an image) — never as generic atmosphere.

## Glassmorphism Default

- Do not reach for frosted-glass/blur-panel treatments as a default surface style. It is a specific, dated aesthetic trend, not a neutral "modern" choice.
- If translucency serves a genuine layering/depth purpose specific to the brand's visual concept, it must be a deliberate decision from that concept — not a reflex.

## Excessive Rounded Corners

- Do not apply large border-radius to every container, button, image, and card by default. Corner treatment (sharp, slightly rounded, fully rounded, mixed) is a brand decision made once and applied consistently — not a generic "friendly SaaS" rounding slapped on everything.

## Excessive/Decorative Icons

- Do not pair every heading or list item with a generic icon (checkmarks, lightning bolts, generic outline icons) purely for visual filler.
- An icon must carry real meaning the text doesn't already convey, or be removed. See the decorative-icon rule already stated in CLAUDE.md.

## Fake Premium Design

- "Premium" is not a formula of gold accents, black backgrounds, and a serif display font applied automatically to signal luxury. That combination is itself now a generic AI-design cliché.
- Real premium feeling comes from restraint, craft, and hierarchy (see [01-apple-design-foundations.md](01-apple-design-foundations.md)) applied to this brand's actual identity — not from a stock "luxury" visual kit.

## Generic AI Copywriting

- Avoid buzzword-driven, superlative-heavy copy: "unlock," "elevate," "seamless," "revolutionize," "empower," "next-level," "game-changing," used without concrete specifics behind them.
- Copy should say something only this business could say, in plain, specific language. If a sentence could appear verbatim on a competitor's site, rewrite it.

## Repeated Sections

- Do not stack multiple sections with identical structure (e.g., five "image-left, text-right, button" blocks in a row). See section rhythm in [02-apple-web-patterns.md](02-apple-web-patterns.md).
- Repetition without variation is a strong visual signal of templated, unconsidered design.

## Arbitrary Visual Effects

- Do not add animation, blur, glow, gradient overlays, or hover effects without a specific reason tied to hierarchy or narrative (see purposeful motion in [04-motion-scroll.md](04-motion-scroll.md)).
- "It looks cool" is not sufficient justification on its own — it must also be true that it serves this page's communication.

## The Core Test

Before shipping any section, ask: **"Would this exact section, unchanged, work fine on a different, unrelated business's website?"**

If yes — it is generic, and it fails. Rebuild it from this specific business's content, audience, and narrative rather than decorating the same generic structure differently. This test is applied formally during the audit in [08-design-audit-quality-gate.md](08-design-audit-quality-gate.md).
