# 02 — Apple-Inspired Web Storytelling Patterns

> These rules are mandatory when relevant. They are not visual templates. The business, audience, content, and page goal always come first.

This file translates the foundations in [01-apple-design-foundations.md](01-apple-design-foundations.md) into web storytelling structure: how a page unfolds as the visitor scrolls. These are narrative patterns, not visual skins — apply them with the brand's own type, color, and imagery (see [05-anti-ai-design.md](05-anti-ai-design.md) for what NOT to default to).

## Heroes

- A hero states the single most important idea of the page immediately — not a generic tagline, not a stock-photo-plus-gradient formula.
- The hero's job is to answer "what is this and why should I care," in the fewest possible words, backed by the strongest available visual proof (product, place, people, data — whatever the business's real asset is).
- Avoid the generic hero formula: centered headline + subhead + two buttons + abstract gradient background. If a hero would work unchanged for a different business, it has failed (see [08-design-audit-quality-gate.md](08-design-audit-quality-gate.md) brand specificity test).
- A hero is allowed to be quiet (a single image, a single line) or dense (a demo, a data view) — the page goal decides, not habit.

## Editorial Storytelling

- Sections should read like a narrative arc, not a stacked list of unrelated features: setup → reveal → detail → proof → resolution/action.
- Each section should feel like the logical next sentence in the story, not an interchangeable block that could be reordered without loss.
- Copy and visuals in a section make one argument together; the visual is not decoration next to the text, it is part of the point being made.

## Visual-First Sections

- Where the business's strongest asset is visual (product, space, craftsmanship, food, place), let the image or footage carry the argument and minimize text.
- Do not caption an obvious image with redundant text. Let strong visuals stand at full width or full bleed when the content warrants it.
- Data-driven businesses can use this same principle with real charts/numbers as the "visual" — never fabricated ones (see [05-anti-ai-design.md](05-anti-ai-design.md)).

## Sticky Storytelling

- A sticky/pinned visual paired with scrolling supporting text is used only when the content genuinely has sequential steps or states to reveal (e.g., a product rotating through features, a process with stages).
- The mechanics (pinning, thresholds, cleanup) are defined in [04-motion-scroll.md](04-motion-scroll.md); this file governs when the pattern is narratively justified.
- Never use sticky storytelling to artificially stretch thin content into a longer scroll. Length must be earned by content.

## Progressive Reveal

- Information unfolds in sequence: the visitor should not need to hold five ideas in their head at once. Reveal one beat, let it land, then reveal the next.
- Progressive reveal is a content-pacing decision first, an animation decision second. The sequence must make sense with motion turned off entirely.
- Do not reveal everything on scroll purely for animation's sake — see purposeful motion in [04-motion-scroll.md](04-motion-scroll.md).

## Whitespace as Pacing

- Whitespace between sections signals a narrative beat change — a pause before the next idea, not wasted space.
- More important reveals get more surrounding whitespace, not less. Cramming the "big moment" next to secondary content undercuts it.
- See the concrete spacing scale in [03-typography-layout-spacing.md](03-typography-layout-spacing.md).

## Controlled Width

- Text and key content sit within a deliberately constrained measure — never edge-to-edge on wide viewports unless the content is a full-bleed visual moment.
- Width should change intentionally per content type (narrow for reading, wide/full for imagery or data), not uniformly across the whole page.

## Section Rhythm

- Alternate pacing and density: a dense/detailed section should be followed by something calmer, not by another dense section.
- Avoid repeating the same section shape back-to-back (e.g., five identical "image left, text right" blocks in a row). Vary composition to match narrative role — see the repeated-sections rule in [05-anti-ai-design.md](05-anti-ai-design.md).
- Rhythm is planned during the narrative step of the process (CLAUDE.md step 4), not improvised block-by-block.

## CTA Restraint

- One primary call to action per narrative moment. Competing CTAs dilute intent and confuse hierarchy.
- Secondary actions, when necessary, are visually and verbally subordinate to the primary one.
- A CTA appears when the story has earned it (after the visitor understands the value), not stapled onto every section by default.

## Scroll as Narrative Device

- Scroll position should correspond to progress through the story, not just trigger decorative motion. The visitor should sense "I am partway through understanding this" as they scroll.
- Scroll-linked reveals must have narrative purpose (see [04-motion-scroll.md](04-motion-scroll.md) for the purposeful-motion rule); scroll is a storytelling instrument, never a gimmick layered on top of a page that would tell the same story without it.
- Never hijack or trap native scroll to force a narrative pace — see the scroll-hijacking rules in [04-motion-scroll.md](04-motion-scroll.md).
