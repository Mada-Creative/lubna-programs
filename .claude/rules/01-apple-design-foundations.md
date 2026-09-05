# 01 — Apple Design Foundations

> These rules are mandatory when relevant. They are not visual templates. The business, audience, content, and page goal always come first.

This file defines the underlying discipline referenced by [CLAUDE.md](../../CLAUDE.md). It is the philosophy layer that every other rules file inherits. Nothing here is about how Apple's website looks — it is about how Apple's design process thinks.

## Purpose

- The goal is not to look like Apple. The goal is to design with the same rigor Apple applies: reduce until only what matters remains, then execute that remainder with total craft.
- Design discipline is a process, not a style. The same discipline produces different-looking results for different businesses. If two unrelated projects end up visually similar, the process was skipped.
- Every project starts from the business, not from a template. See the mandatory five-step process in CLAUDE.md (understand the business → audience → page goal → narrative → visual concept → implementation). This file assumes that process has already run.

## Simplicity

- Simplicity is the result of removal, not minimalism as decoration. Add nothing that does not serve the message.
- Every element on a page must justify its presence. If removing it does not weaken the communication, remove it.
- One idea per section. A section that tries to communicate three things communicates none of them clearly.
- Simplicity is not "less content." It is the right content, presented without noise.

## Hierarchy

- Every screen has exactly one thing the visitor should notice first. If there are two, the hierarchy is broken.
- Visual weight (size, contrast, position, whitespace around an element) must match importance. Never let a secondary element compete with the primary one.
- Hierarchy is established through scale, contrast, and spacing before it is established through color or decoration.
- A page should be scannable in five seconds and still make sense: headline → supporting idea → proof → action.

## Content-First Design

- Design exists to serve the content and the message, not to decorate a layout that content is later poured into.
- Never invent a layout first and fill it with lorem-ipsum-shaped copy. Real content (or a real content plan) determines the composition.
- If the content is thin, the fix is better content or a smaller page — not decorative filler, fake stats, or padding sections (see [05-anti-ai-design.md](05-anti-ai-design.md)).
- Imagery, data, and product visuals are content. Treat them with the same editorial discipline as text.

## Craft

- Details are not optional polish added at the end — they are part of the design decision itself: alignment, optical spacing, consistent corner radii, consistent shadow logic, consistent motion timing.
- Nothing should look "close enough." Inconsistent spacing, misaligned baselines, and mismatched easing curves are visible even when a user can't name what's wrong.
- Craft applies equally to code: clean, deliberate implementation is part of the design, not a separate concern (see [08-design-audit-quality-gate.md](08-design-audit-quality-gate.md)).

## Restraint

- The default answer to "should we add this?" is no, until proven necessary.
- Restraint applies to color count, font count, animation count, section count, and CTA count.
- Silence (whitespace, pause, a plain section) is a legitimate design tool, not a gap to fill.
- A busier page is not a more premium page. Premium reads as confident and quiet, not loud and dense.

## Flexibility

- The discipline (clarity, hierarchy, restraint, craft) is universal and non-negotiable.
- The visual expression of that discipline must change per project: different type, different color system, different imagery style, different tone — driven by the business, audience, and industry established in step 1–3 of the process.
- Two projects following these rules correctly should not look like each other. If they do, the visual-concept step was skipped.

## Accessibility

- Accessibility is a foundation of the design, established at the same time as hierarchy and typography — not a pass applied after the fact.
- Minimum: real semantic structure, sufficient color contrast, visible focus states, keyboard operability, meaningful alt text, respect for `prefers-reduced-motion`.
- An inaccessible page is not a finished page, regardless of how polished it looks visually. See the accessibility checks in [08-design-audit-quality-gate.md](08-design-audit-quality-gate.md).

## Brand-Before-Imitation

- Never copy Apple's colors, typography, layouts, iconography, or product-page structure. That is imitation, not discipline, and it is explicitly prohibited by CLAUDE.md.
- The client's brand identity, industry conventions, and audience expectations always override any "Apple-style" instinct.
- When in doubt, ask: "does this decision come from this business's identity, or did it come from mimicking Apple.com?" Only the first is acceptable.
- Apple is a reference for rigor, not a reference for visuals.
