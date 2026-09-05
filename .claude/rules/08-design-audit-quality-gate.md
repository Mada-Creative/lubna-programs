# 08 — Design Audit & Quality Gate

> These rules are mandatory when relevant. They are not visual templates. The business, audience, content, and page goal always come first.

This file is the mandatory final gate before any page is considered finished. It formalizes the "before considering a page finished, critically evaluate..." checklist from CLAUDE.md into a concrete audit. A page does not ship on visual polish alone — it must pass this audit.

## How To Use This Gate

- Run this audit after implementation, against the actual built page (real content, real viewport testing) — not against a mockup or intention.
- Any critical failure (see Scoring System) means the page is not finished. Fix the underlying structure, not just the surface detail — per CLAUDE.md: "redesign the underlying structure instead of decorating it."

## Brand Specificity Test

- Apply the core test from [05-anti-ai-design.md](05-anti-ai-design.md): "Would this exact page, unchanged, work fine for a different, unrelated business?"
- If yes for the page as a whole, or for any major section, that section fails and must be rebuilt from this business's actual content and narrative.

## AI-Look Audit

- Check systematically against every item in [05-anti-ai-design.md](05-anti-ai-design.md): card-grid defaults, generic SaaS structure, fake stats, fake testimonials, gradient/glassmorphism defaults, excessive rounding, decorative icons, fake-premium visual formula, generic buzzword copy, repeated identical sections, arbitrary effects.
- Any single confirmed instance is a fail for that item — fix it, don't rationalize it as a one-off exception.

## Typography Audit

- Confirm the type scale is small and deliberate, hierarchy is legible at a glance, weights are used consistently by role (see [03-typography-layout-spacing.md](03-typography-layout-spacing.md)).
- Verify clamp() bounds at both viewport extremes (smallest supported width, largest supported width) — no oversized or illegible results at either end.
- Verify line-height and line-length (measure) on real body copy, not placeholder text.

## Whitespace Audit

- Confirm spacing follows the tiered system (section/component/element) from [03-typography-layout-spacing.md](03-typography-layout-spacing.md) and functions as narrative pacing per [02-apple-web-patterns.md](02-apple-web-patterns.md).
- Flag any cramped section and any arbitrary, unscaled spacing value that breaks the system.

## Motion Audit

- Every animation must pass the purposeful-motion test in [04-motion-scroll.md](04-motion-scroll.md): does it clarify hierarchy or narrative, or is it decorative?
- Confirm durations/easing are consistent with the system, `prefers-reduced-motion` is implemented and actually shows correct end-states, and no scroll-hijacking violations are present.
- Confirm motion performance: transform/opacity-only animation, no dropped frames from excessive simultaneous animated elements.

## Mobile Audit

- Mobile is held to the same quality bar as desktop — not a degraded fallback. Verify hierarchy, spacing, and narrative order all still work correctly at mobile widths.
- Verify touch targets, thumb-reachable primary actions, and that mobile-specific motion adjustments from [04-motion-scroll.md](04-motion-scroll.md) are applied.

## RTL Audit (When Applicable)

- Verify full mirroring per [06-arabic-rtl.md](06-arabic-rtl.md): layout order, logical CSS properties (no leftover hardcoded left/right), icon mirroring correctness, navigation and CTA direction, form alignment, numeral consistency.
- Test actual mixed bidi content (Latin/numerals inside Arabic copy) for correct isolation.

## Accessibility Audit

- Color contrast meets at least WCAG AA for text and meaningful UI elements.
- Semantic HTML structure (headings in order, landmarks, real buttons/links), meaningful alt text, visible keyboard focus states, full keyboard operability.
- Correct `lang`/`dir` attributes set, including for mixed-language fragments (see [06-arabic-rtl.md](06-arabic-rtl.md)).

## Performance Audit

- Asset weight is appropriate to actual display size (properly sized/compressed images and video, no unnecessarily large media).
- Animation cost checked per the Motion Audit above; no layout-thrashing properties animated.
- Overall load and interaction responsiveness tested, not assumed.

## Engineering Quality Audit

- Code is clean and deliberate: no arbitrary magic numbers where the system's scale (type, spacing) should be used instead.
- Responsive behavior verified across breakpoints, not just at design-time widths.
- No orphaned event listeners, scroll-trigger instances, or animation cleanup issues (see [04-motion-scroll.md](04-motion-scroll.md)).

## Scoring System

- Rate each audit category above as **Pass**, **Minor Issue**, or **Critical Fail**.
- **Critical Fail** = a violation of an explicit rule in any rules file (e.g., a fabricated statistic, a generic SaaS template, broken RTL mirroring, no reduced-motion fallback, failing contrast). Any single Critical Fail blocks shipping the page, regardless of how strong other categories score.
- **Minor Issue** = a deviation worth fixing but not rule-breaking (e.g., slightly inconsistent spacing in one spot). Minor issues should still be fixed before considering the page done, but do not block iteration in progress.
- A page is only "finished" when every category is at least Pass, with zero outstanding Critical Fails.

## Required Critique Format

Before declaring a page finished, produce a short written self-critique in this structure:

1. **Narrative** — What is this page's story, in one sentence? Does every section serve it?
2. **Hierarchy** — What is the single most important thing on this page, and is that obvious in five seconds?
3. **Typography & Composition** — Does the type scale and layout feel deliberate and specific to this brand?
4. **Whitespace** — Where does the page breathe, and where (if anywhere) does it feel cramped or arbitrarily spaced?
5. **Brand Specificity** — Would this page work unchanged for a different business? (Must be "no.")
6. **Originality / AI-Look** — Any item from [05-anti-ai-design.md](05-anti-ai-design.md) present, even partially?
7. **Mobile Quality** — Does mobile hold the same quality bar as desktop?
8. **RTL (if applicable)** — Is mirroring fully correct, not just text direction?
9. **Accessibility** — Does it meet the minimums in the Accessibility Audit above?
10. **Performance** — Is asset and animation cost justified by what it delivers?
11. **Motion Restraint** — Is every animation traceable to a specific hierarchy or narrative purpose?

If any answer above reveals a generic or unjustified decision, fix the underlying structure — not the surface decoration — before shipping.
