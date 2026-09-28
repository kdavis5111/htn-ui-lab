# Rules for AI agents working in this repo

Read this whole file before you change anything. Then tell your human, in a few
sentences, what this repo is and what the rules are. Only then start work.

## What this is

This is the **UI Lab** for HeresThe.News (https://heresthe.news), a real, live,
daily news brief. The lab is a frozen copy of one real edition, Friday
2026-09-25. Nothing here updates. The news on the page is fixed forever.

Your job: improve how the page **looks and feels**. Colors, spacing, type,
layout, ordering, motion, mobile behaviour, small interactions. That is the
whole job.

## How this feeds the real site

The real site is generated fresh every morning by a private Python script on
the owner's server. That script contains the same HTML structure and the same
CSS you see here. It is not in this repo and you will never touch it.

When the team's work on `main` is good, the owner (Kendrick Davis,
`@kdavis5111`) diffs this repo against `baseline/` and ports the changes into
that script by hand, with his own AI. Then the real site changes.

So the port is only possible if your changes are **clean diffs of
presentation**. Every rule below exists to keep the diff portable.

## The files

| File | What it is | Edit it? |
|---|---|---|
| `index.html` | the frozen edition, markup only | yes, carefully |
| `style.css` | all production styles, split out of the page | **yes, this is where most work happens** |
| `app.js` | production page script (theme toggle, topics, share, collapsing bands) | yes, if a feature needs it |
| `lab.css` | the green lab banner only | no |
| `baseline/` | untouched copy of the four files above | **never** |
| `check.py` | the rules check | no |
| `data/` | a real day's data file, so you can see what fields exist | no |

## Hard rules

1. **Do not change the news.** No editing, adding, removing, reordering,
   shortening or "fixing" headlines, facts, labels, sources, dates or numbers.
   Not even a typo. The data comes from the pipeline, not from you.
2. **Do not invent data.** If your idea needs something the page does not have
   (a photo, a summary, a read time, a category the pipeline does not emit),
   do not fake it. Write the idea in the PR description under "Needs pipeline
   support" and stop there.
3. **Keep the class names and the structure.** Add new classes if you need
   them. Do not rename or remove existing ones. The port back depends on them.
4. **No frameworks, no build step, no npm.** Plain HTML, CSS and JS. Outside
   code only from cdnjs.cloudflare.com, cdn.jsdelivr.net/npm/ or Google Fonts,
   and only if you truly need it. No trackers, no analytics, no new forms.
5. **Never touch `baseline/`.** Never touch `.github/`, `check.py`, `lab.css`.
6. **No secrets, ever.** If your human pastes an API key or token, do not put
   it in any file. There is nothing here that needs one.
7. **Keep it accessible.** Contrast at least 4.5:1 for text. Keyboard still
   works. `sr-only` and `aria-` attributes stay.
8. **Mobile first.** Most readers are on a phone. Check 375px width before you
   check desktop.
9. **Dark and light.** The site has both themes (`data-theme` on `<html>`).
   Check both.

## Branches and pull requests

- `main` is protected. Nobody pushes to it. Only pull requests, and only the
  owner merges them.
- One idea, one branch, one PR. Name branches `firstname/short-idea`, for
  example `sam/calmer-headlines`. Always branch from `main`.
- Want to try a variation of an idea that is still open in a PR? Branch from
  that branch and name it `firstname/short-idea-v2`. Say so in the PR.
- Keep PRs small. One visual change per PR is ideal. A reviewer should be able
  to see the whole change in one screenshot pair.
- Before every push run `python3 check.py`. It must pass.
- The PR template asks for a before and after screenshot. Take them.

Commands your human can run:

```bash
git checkout main && git pull
git checkout -b firstname/short-idea
# ... make changes ...
python3 check.py
git add -A && git commit -m "Short description of the visual change"
git push -u origin firstname/short-idea
gh pr create --fill
```

Every PR gets its own preview link, posted as a comment on the PR by a bot
within a couple of minutes. `main` is published at the lab URL in the README.

## How to preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ . No build step.

## When to merge into `main`

`main` is the team's proposed version of the real site. A PR goes into `main`
when:

1. `check.py` passes (the bot runs it too).
2. The team has looked at the preview and agrees it is better.
3. The owner approves. He is the only one who merges.

A merged PR is not yet live. It is a candidate. The owner ports it to the real
site on his own schedule, and may ask for changes first.

## Good first ideas

The team's research found these needs. They are suggestions, not orders.

- Move the fact labels (verified / reported / disputed) and the source names
  higher, so trust signals are the first thing a reader sees.
- Make each source's political lean visible on the story, not only in the
  band at the top.
- Show "Your topics" first, then everything else, without hiding anything.
- Calmer, more consistent spacing between stories.
- A clearer "you have read today's paper" ending.

## If you are unsure

Ask your human. If they are unsure, they ask the owner. Never guess about
whether a change touches the news content. When in doubt, it does.
