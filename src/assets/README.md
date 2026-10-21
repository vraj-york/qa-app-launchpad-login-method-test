# Daytick — Design Contract

**Design genome:** type personality humanist serif (Fraunces) + Public Sans · brand-hue deep moss green + ochre accent (no blue/indigo) · neutrals warm paper-tinted · layout focused single-column app (top bar, no sidebar) + split login · density airy, soft 16–20px radii, bordered cards · signature category = the "day progress arc" in the header stats. Diverged from generic SaaS on: display face, hue family, warm neutrals, layout archetype, shape language.

**Positioning:** Daytick is the calm to-do list for one person — sign in in seconds, see today, tick things off.
**Personality:** approachable / warm / guided / uncluttered.
**Persona:** Anyone with a busy day who wants a list that feels light, not like project-management software. Success = first task ticked within a minute of signing in.

**IA map:** Login (standalone) → Today (single work surface: add, filter, search, tick, edit, delete). Account model: single-user, fake local session. Modern patterns: optimistic tick, inline edit, saved per-user lists in localStorage, filter pills + sort.

**Type:** Fraunces (display, 28–44px) + Public Sans (UI/body 14–16px); scale hero 40 / title 30 / section 20 / body 15 / caption 12; tight tracking on display.
**Color:** brand moss `#3E6B34`, accent ochre `#D98E2B`, danger clay `#C4522E`; warm neutrals paper `#FAF6EE`, cream `#FFFDF7`, ink `#29231B`, line `#E7DCC8`. Tokens via Tailwind config colors. Dark mode: not shipped (single warm light theme, intentional).
**Layout:** 4/8px rhythm; login split panel; app max-w-3xl list column with stat strip above; one focal point per viewport (the list).
**Voice:** warm, plain, encouraging. Headline: "Today, one tick at a time." Empty: "Nothing here yet — add your first task above."
**Signature moment:** Day progress arc — a moss progress bar + % that fills as tasks are ticked, with an "All done" celebration state.

## Motif library & visual register
Register: warm/organic — rounded forms, 2px rounded strokes, soft shadows, light from top-left.
Motifs: (1) the tick, (2) the paper list slip, (3) the pencil, (4) the sun arc (a new day), (5) the potted sprout (small wins grow).

## Asset table
| Page | Surface | Class | Asset | Justification | Motif | Size cap |
|---|---|---|---|---|---|---|
| Login | Left panel | Emotional | `illustrations/login-art.svg` | Orients first-time visitor: shows the product's world (list, pencil, a calm day) | list slip, pencil, sun, sprout | ≤80% panel width |
| Today | Empty list | Emotional | `illustrations/empty-tasks.svg` | Explains empty state, points to Add box | list slip, pencil | ≤220px wide |
| Today | All-done state | Emotional | `illustrations/all-done.svg` | Celebrates completion, humanises success | tick badge, sun arc | ≤200px wide |
| All | Header chrome | Chrome | `logos/logo-mark.svg` | Brand identity / wayfinding | tick | 36px |
| All | Controls | Task | `icons/*.svg` | Label actions (add, search, edit, delete, sign out, show/hide password) | tick family, 24px grid, 2px stroke | 16–20px |

Task surfaces with data get icons only — no illustration beside live tasks (inversion rule).

## Geometry / finish
Icons: 24×24 viewBox, stroke 2, round caps/joins, explicit ink fills (used via `<img>`). Illustrations: Medium detail — base + shadow + highlight ramps in moss/ochre/paper hues, one light source (top-left), soft contact shadows.
Placement map: logo-mark → Header + Login; login-art → Login left panel; empty-tasks → empty list; all-done → completed-all state; icons → buttons/inputs per component.
