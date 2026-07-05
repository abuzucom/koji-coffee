
# Redesign: Paper & Ink editorial

Strip the site back to a precise, printed-matter feel. Kill the sage palette, flatten all decorative effects, and commit to a single-column editorial rhythm driven by typography and negative space.

## Design tokens (rewrite `src/index.css` + `tailwind.config.ts`)

Palette — three modes share the same ink, only the paper changes:

```text
Light  bg #f5f3ee   surface #ebe8e0   ink #0d0d0d   muted #6b6a65   rule #d9d5cb
Grey   bg #b8b5ad   surface #a8a59d   ink #14140f   muted #4a4842   rule #928f86
Dark   bg #0d0d0d   surface #16161a   ink #f5f3ee   muted #8a8880   rule #2a2a28
```

- One accent only: ink itself. No color accents, no gradients, no glows, no colored shadows.
- Border-radius: 0 across the board (buttons, cards, inputs). Sharp corners.
- Shadows: remove. Use 1px hairline rules (`--rule`) for separation.
- Motion: remove decorative float/pulse. Keep only: fade-up on section enter (200ms, ease-out), underline slide on links.

## Typography (replace fonts)

- Install `@fontsource-variable/space-grotesk` and `@fontsource-variable/dm-sans` via bun.
- Remove Instrument Serif, Inter Tight, and JetBrains Mono packages.
- Import both in `src/main.tsx`; map in `tailwind.config.ts`:
  - `font-display` → Space Grotesk Variable
  - `font-sans` → DM Sans Variable
  - `font-mono` → keep system `ui-monospace` stack (used only for tiny metadata labels)
- Scale (desktop): H1 96/0.95/-0.03em, H2 56/1.05/-0.02em, H3 28/1.2, body 17/1.55, small 13/1.5 uppercase tracking 0.14em.
- Consistent 8px baseline; section vertical rhythm at 160px desktop / 96px mobile.

## Layout — single column, editorial

Fixed max-width 720px centered, with a left-aligned metadata gutter that peeks out at ≥1024px (absolute-positioned `<aside>` with issue number, section index, timestamp — pure typography, no boxes).

Section order and treatment:

1. **TopBar** — hairline bottom rule, wordmark left, theme switcher right as three text labels `light · grey · dark` (active one underlined). Drop the pill/button chrome.
2. **Hero** — replace generic copy. New structure:
   - Eyebrow: `ISSUE 001 — FIELD NOTES`
   - Headline (H1, 3 lines, ragged right): `A small room for people who brew coffee like a laboratory.`
   - Sub (single sentence, muted): one line describing the Discord.
   - Primary CTA: plain text link with animated underline `Request an invite →`. No filled button.
   - Below CTA: three inline metadata pairs separated by `·` (members count optional, founded year, timezone note).
3. **About** — two short paragraphs, drop cap on first paragraph (Space Grotesk, 5 lines).
4. **What we do** — replace card grid with a numbered list (`01 — 07`), each row: number, title (H3), one-sentence description, hairline rule between rows. No cards, no icons.
5. **Principles** — pull-quote block, large italic-weight Space Grotesk, attribution line below.
6. **FAQ** — plain `<details>` with hairline separators, chevron replaced with `+ / –` text glyphs.
7. **JoinBand** — full-bleed inverse (ink bg, paper text) with one sentence and the same text-link CTA. Only inverse moment on the page.
8. **Footer** — three columns collapse to stack: legal links, security.txt, repo link. Bottom line: `koji.coffee — no cookies, no trackers, no accounts.`

## Files to touch

- `src/index.css` — replace token blocks for `.light`, `.grey`, `.dark`; remove gradient/shadow tokens; add rule/muted tokens.
- `tailwind.config.ts` — new fontFamily map; remove custom shadow/gradient extensions; set `borderRadius.DEFAULT: '0'`.
- `src/main.tsx` — swap font imports.
- `package.json` — via `bun add` / `bun remove`, swap fontsource packages.
- `src/components/TopBar.tsx` — text-only theme switcher, hairline rule.
- `src/components/Hero.tsx` — full rewrite (copy + structure above).
- `src/components/About.tsx` — drop cap, tighten copy.
- `src/components/LabCards.tsx` → rename intent to `Register.tsx` (numbered list). Keep filename to avoid churn, rewrite contents.
- `src/components/Values.tsx` — pull-quote treatment.
- `src/components/FAQ.tsx` — `<details>` with `+/–`.
- `src/components/JoinBand.tsx` — inverse band, text-link CTA.
- `src/components/Footer.tsx` — three-column → stack, tighten copy.
- `src/pages/Privacy.tsx`, `Cookies.tsx`, `Terms.tsx` — apply new type scale (no logic changes).
- Delete unused decorative CSS (glow, gradient utilities) and any lucide icon imports that go with removed cards.

## Out of scope

- No content changes to legal pages beyond typography.
- No changes to CI, CSP, or `src/config/site.ts`.
- No new dependencies beyond the two fontsource packages.

## Verification

Rebuild, then Playwright screenshot at 1280×1800 in all three modes plus 390-wide mobile. Confirm: no colored accents, hairlines visible, hero fits above fold on 1280×800, no console errors.
