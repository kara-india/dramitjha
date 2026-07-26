# Queued Task: Premium "new-tech clinical" visual pass — dramitjha

**Status:** QUEUED (Do not start now — reserved for next session when user requests "continue")

## Task Overview
Vibe target: Think **Whoop / Oura / well-funded sports-recovery startup**, not a hospital brochure. Dark, precise, data-forward, calm confidence — not clinical-sterile, not flashy-startup neon.

## Design Tokens & Utilities to Reuse (Do Not Invent New Ones)
- **Background:** `--ink` (`#102321`, deep forest teal)
- **Accent 1:** `--lime` (`#d5f14c`, electric lime) — use sparingly, for the ONE action per screen that matters (primary CTA, active state, key metric)
- **Accent 2:** `--orange` (`#fb6843`, coral) — secondary emphasis only
- **Type:** Outfit for headings, Inter for body
- **Glass utilities:** `.glass-card`, `.glass-header` (already defined in `globals.css`) — use these for floating/overlapping elements instead of writing new blur CSS
- **Motion:** Existing duration scale (100/200/300/500/800ms) and `ease-out` / `snappy` easing curves

## Execution Guidelines
1. **Data/credibility as a design element**: Turn stats (rating, years of experience, patients treated, recovery stage counts) into visually distinct metric card components — number + label.
2. **Precision over decoration**: Hairline borders (`border-slate-800`), tight alignment, generous whitespace.
3. **One accent color doing real work per section**: Avoid lime + orange + teal competing on the same screen.
4. **Instrumentation motion**: Numbers counting up, subtle fade-in-from-below on scroll (`fadeUp` variant in `page.tsx`).
5. **Token Guardrail**: Before changing any section, name which existing token/utility class is being reused.

## Scope
- Files: `src/app/page.tsx` and shared components in `src/components/` only.
- Do NOT touch: routing, Prisma schema, API routes, auth, booking submission logic, WhatsApp integration.
- Do NOT add new npm dependencies.

## Deliverables for Execution Phase
- Screenshot/diff summary of each modified section at 375px and 1440px.
- One-line note per section naming which existing token/utility was reused.
