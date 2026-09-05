# 04 — Motion & Scroll

> These rules are mandatory when relevant. They are not visual templates. The business, audience, content, and page goal always come first.

This file governs how motion is implemented in support of the narrative patterns in [02-apple-web-patterns.md](02-apple-web-patterns.md). Motion is engineering as much as design — treat performance and accessibility requirements here as non-negotiable, not optional refinements.

## Purposeful Motion

- Every animation must clarify something: reveal hierarchy, show a relationship, confirm an action, or guide attention to what matters next.
- If a motion effect were removed and nothing about understanding the page got worse, remove it (see the "meaningless animation" and "arbitrary visual effects" rules in [05-anti-ai-design.md](05-anti-ai-design.md)).
- Motion should never be the first design idea. It is added after the static hierarchy and layout already work without it.

## Durations

- Micro-interactions (hover, button press, small state change): ~120–200ms.
- Meso transitions (element entrance, section reveal, menu open): ~250–500ms.
- Macro/narrative transitions (sticky storytelling steps, full-section transforms): ~500–900ms, occasionally longer only when tied to a deliberate scroll-driven scrub rather than a fixed timer.
- Longer is not more premium. Sluggish motion reads as unresponsive, not luxurious.

## Easing

- Use named, deliberate easing curves (e.g., custom cubic-béziers tuned per project) — never the browser default `ease` or linear timing for anything meant to feel crafted.
- Entrances typically ease out (fast start, gentle settle); exits ease in; combined move+fade uses a curve tuned so the two properties feel synchronized, not staggered awkwardly.
- Keep a small, consistent set of easing curves reused across the whole site — a different curve per component reads as sloppy, not varied.

## Scroll-Triggered Reveals

- Trigger reveals based on meaningful viewport thresholds (e.g., element ~15–25% into view), not the instant an element enters the viewport edge.
- When revealing multiple related elements, stagger them with a small, consistent offset (~40–100ms) so the sequence reads as one coordinated reveal, not simultaneous popping or a laggy cascade.
- Reveals should complete once and stay resolved — don't re-trigger disruptive animation every time the user scrolls back and forth past the same element.

## Sticky Storytelling (Implementation)

- Pin the visual element only for the exact scroll distance its narrative content needs — measure content length first, then set the pinned range; never pin an arbitrary fixed height.
- Always provide an explicit unpin/release point so the layout returns to normal flow cleanly with no jump or overlap.
- Clean up pinning/scroll-trigger instances on route change or component unmount to avoid orphaned listeners and layout bugs.

## Parallax

- Use parallax sparingly and subtly — small depth offsets (background moving slower than foreground), not dramatic layer separation that fights readability.
- Never apply parallax to body text or interactive controls; it belongs on background/atmospheric imagery only.
- Disable or heavily reduce parallax on mobile (see Mobile Motion below) and always under `prefers-reduced-motion`.

## GSAP Usage

- Prefer GSAP with ScrollTrigger for complex, sequenced, or scroll-scrubbed narrative animation (sticky storytelling, multi-step reveals, precise scrub-linked timelines).
- Always `kill()`/revert ScrollTrigger instances and timelines on component unmount or page transition to prevent memory leaks and duplicated triggers on re-render.
- Batch and reuse timelines where possible instead of creating a new instance per scroll event.

## CSS-Only Motion

- Prefer plain CSS transitions/animations for simple, self-contained state changes (hover, focus, simple fade/slide entrances, toggles) — don't reach for a JS animation library where CSS alone is sufficient.
- CSS `@media (prefers-reduced-motion: reduce)` must be implemented directly alongside any CSS animation, not only in JS-driven motion.

## Framer Motion / Motion Library Usage

- In React contexts, prefer Framer Motion (Motion) for component-level enter/exit transitions, layout animations, and gesture-driven interaction — reserve GSAP for the heavier scroll-orchestrated narrative work.
- Use `AnimatePresence` correctly for exit animations; don't unmount elements before their exit transition completes.
- Respect the same duration/easing values as the rest of the system — a component using Framer Motion should feel identical in timing to a GSAP-driven section elsewhere on the page.

## Mobile Motion

- Reduce or remove parallax and pinned/sticky storytelling effects on small viewports where scroll real estate is limited and hijacked scroll feels worse on touch.
- Favor simple, fast entrance transitions on mobile over elaborate multi-stage sequences.
- Test all motion on an actual touch device or emulation — scroll-linked effects tuned on a mouse-wheel desktop often feel wrong with touch-scroll momentum.

## Reduced Motion

- Every scroll-triggered, parallax, or auto-playing animation must have a `prefers-reduced-motion: reduce` fallback that shows the end state directly (content visible, no motion) rather than skipping content entirely.
- Reduced motion is a requirement, not an enhancement — ship it in the same pass as the animation itself, not as a later patch.

## Performance

- Animate only `transform` and `opacity` wherever possible; avoid animating properties that trigger layout or paint (`width`, `top`/`left`, `box-shadow` size, etc.).
- Use `will-change` sparingly and only on elements actively animating — remove it once the animation completes; leaving it on everything degrades performance.
- Keep total simultaneous animated elements reasonable; a page animating dozens of elements at once will drop frames regardless of how each one is optimized.
- Motion cost is part of the performance audit in [08-design-audit-quality-gate.md](08-design-audit-quality-gate.md).

## Scroll Hijacking Rules

- Never trap, redirect, or slow down native scroll to force a pace on the user. The user's scroll input must always feel like it's driving the page.
- Sticky/pinned sections are the one acceptable exception — and only when implemented so the pin releases cleanly and native scroll resumes immediately after, per the Sticky Storytelling rules above.
- Never disable normal scroll to play a full-page "scroll-jacked" animation sequence in its place. This is a common generic-agency effect and is explicitly disallowed — it breaks user expectations and accessibility.
- Horizontal-scroll-on-vertical-input sections are allowed only for genuinely horizontal content (e.g., a gallery), must be clearly signaled, and must not replace the page's primary vertical scroll.
