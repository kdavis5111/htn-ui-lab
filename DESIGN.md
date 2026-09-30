# HeresThe.News design system

This is the design system pulled out of the real site. It is short on purpose.
The live version of everything below is `styleguide.html` (open it with
`python3 serve.py` then go to `/styleguide.html`, or see
https://kdavis5111.github.io/htn-ui-lab/styleguide.html).

**The one rule:** build from these parts. Restyle a part, extend a part, or
propose a new part. Do not quietly invent a second version of one that exists.

## Feel

Calm. Paper, not screen. Nothing blinks, nothing sells. The reader should
finish and feel done. Every element earns its place by helping someone read
and trust the news; decoration does not.

## Tokens

All colors, fonts and radii are CSS variables in `:root` at the top of
`style.css`. Use the variable, never the hex. The page ships dark; the
variables carry both palettes, so a theme is a token swap.

| Token | Meaning | Use for |
|---|---|---|
| `--paper` | page background | body only |
| `--card` | raised surface | story cards, bands, signup cards |
| `--ink` | primary text | headlines, body |
| `--ink-2` | secondary text | summaries, notes |
| `--ink-3` | tertiary text | labels, counts, metadata |
| `--line` | hairline borders | dividers, card edges |
| `--accent` | the green | links, active states, primary buttons |
| `--accent-tint` | pale green | selected chips, hover fills |
| `--clay` | the orange dot | the wordmark dot only, plus rare emphasis |
| `--red` / `--gold` / `--blue` | status colors | disputed / developing / updated |
| `--radius` | 14px | cards and buttons |
| `--elev`, `--elev-sm` | shadows | cards, small controls |
| `--serif` | headline face | headlines, section heads, wordmark |
| `--sans` | body face | body text, buttons, UI |
| `--mono` | label face | chips, counts, dates, small caps labels |
| `--scale` | text-size multiplier | set by the reader; never hard-code px font sizes on text |

## Type

Three voices, and each has a job.

- **Serif** says "this is news." Headlines, band titles, the wordmark.
- **Sans** says "this is the app." Body copy, buttons, forms, notes.
- **Mono, uppercase, letter-spaced** says "this is metadata." Status chips,
  counts, dates, the legend. Small, quiet, never for sentences.

Sizes are `rem`, so the reader's text-size setting scales everything.
Line length is capped by `.wrap` at 660px.

## Space and shape

- Rhythm is 4px. Paddings are 8, 12, 14, 18, 20, 24, 36.
- Cards use `--radius` (14px) and `--elev`. Small controls use half that.
- Borders are 1px `--line`. No 2px borders except the dashed invite card,
  which is meant to look different.
- Motion is 140ms ease and respects `prefers-reduced-motion`.

## Components

Class names are the contract. Restyle freely; keep the names.

| Component | Class | What it is | Notes |
|---|---|---|---|
| Wordmark | `.wm-a` `.wm-dot` `.wm-b` | HeresThe . News | the dot is `--clay`; only use of that color |
| Masthead | `.masthead` `.motto` | title and motto at the top | |
| Nav | `.nav` `.navchip` `.navchip.active` | page switcher pills | `aria-pressed` carries state |
| Publish note | `.pub-note` `.ai-note` | when and how the paper was made | mono |
| Band | `.cat-band` `.cat-head` `.cat-count` | a category section | `.picked-band` when it is one of the reader's topics |
| Story | `.story` `.story-sum` `.headline` `.sum-meta` `.story-body` | one collapsible story | native `<details>`; no JS needed to open |
| Update note | `.update-note` `.un-k` | what changed since yesterday | only when there is a change |
| Impact | `.impact-wrap` `.impact-thumb` `.impact` `.impact-label` | why it matters, with optional photo | photo is optional; text is not |
| Facts | `.facts-head` `.fcount` `.fc-v` `.fc-r` `.facts` `.fact` `.fact-text` `.corr` | the labeled claims | the heart of the product |
| Status chip | `.chip.status-verified` `.status-reported` `.status-disputed` | the label on a fact | mono, colored by status |
| Updated chip | `.chip.chip-upd` | "updated" in the headline row | |
| Sources | `.srcs-head` `.source-links` `.src` `.lean-tag` | outlets that covered it, with lean | lean is text, never color alone |
| Share | `.share-row` `.share-btn` | share one story | |
| Show more | `.band-more` `.band-more-btn` | reveals the rest of a band | |
| Signup card | `.signup-card` `.signup-head` `.signup-sub` `.signup-form` `.signup-input` `.signup-btn` | email signup, topics invite, install prompt | one card style, three uses |
| Topics picker | `.int-title` `.int-grid` `.int-chip` `.ord-list` `.triage-actions` `.triage-btn` `.triage-btn.primary` | choose and order topics | built by `app.js` |
| Section head | `.section-head` | About and Support headings | serif |
| Plan card | `.plan-card` `.pc-title` `.pc-price` `.pc-freq` `.pc-btn` | a support option | |
| Meter | `.dime-meter` `.dm-bar` `.dm-count` | funding progress | |
| Score card | `.score-grid` `.score-card` `.sc-row` `.sc-win` `.sc-team` `.sc-pts` | one game result | sports band |
| Box office row | `.bo-row` `.bo-rank` `.bo-title` `.bo-gross` `.bo-bar` `.bo-sub` | one film's take | |
| Roster | `.lean-row` `.lean-band` `.roster-today` | the outlet list on About | |
| Lab banner | `.lab-banner` | lab only, not on the real site | leave it |

## Buttons, ranked

1. **Primary**: `.signup-btn`, `.triage-btn.primary`, `.pc-btn`. Filled accent.
   One per view, for the one thing we hope the reader does.
2. **Secondary**: `.triage-btn`, `.share-btn`, `.band-more-btn`. Outlined.
3. **Chip**: `.navchip`, `.int-chip`, `.lg-chip`. Pill, toggles, carries a state.
4. **Icon**: `.fh-info`. Tiny, explains something, never the only way to do it.

If you need a button, it is one of these four. Pick the rank, use the class.

## States

- Hover: border or text moves to `--accent`. No color fills on hover except
  primary buttons, which brighten.
- Active or selected: `--accent-tint` fill, `--accent` text, `aria-pressed`.
- Focus: visible ring. Never remove outlines.
- Disabled: 50% opacity, no hover.

## Content rules that look like design rules

- Labels are words, never only colors or icons. A color-blind reader must be
  able to tell verified from disputed.
- Numbers, dates and counts are mono.
- Nothing is hidden behind a hover. Phones do not hover.
- No red except for disputed. No urgency styling anywhere.

## Adding a component

1. Check the table. Nine times in ten the part exists.
2. If it truly does not: add it to `style.css` with a new class, add an
   example to `styleguide.html`, add a row to the table above, and make it its
   own PR titled "New component: ...". Say what existing part it replaces or
   why none fit.

## Trying another design system

Fair experiment: on a branch, replace the values in `:root` with another
system's tokens (Material, GOV.UK, Open Props, a brand you like). The whole
page changes in one file. Screenshot it, write what you learned in the PR.
Most of these PRs will not merge, and that is fine; the point is the
comparison.

Not a fair experiment: rebuilding the markup around another system's
components. That breaks the class contract and cannot be ported back.

## Why this matters for the port

The real site is generated by a script that holds the same class names and
the same tokens. A change made in tokens and existing classes ports back in
minutes. A change that invents new structure ports back in hours, or not at
all.
