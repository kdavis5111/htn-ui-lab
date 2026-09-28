# HeresThe.News UI Lab

A safe copy of [HeresThe.News](https://heresthe.news) for the IS 551 team
project. The page is one real edition, frozen on Friday 2026-09-25. It never
updates. You change how it looks. The news stays the same.

**Lab site (main):** https://kdavis5111.github.io/htn-ui-lab/
**Every pull request gets its own preview link,** posted by a bot as a comment.

## Why a frozen copy

The real site is built every morning by a private script on Kendrick's server.
That script holds the same HTML and CSS you see here. When the team's work is
good, Kendrick diffs this repo against `baseline/` and ports the changes into
the script. Then the real site changes. Your job is the look. His job is the
port.

## The rules in one breath

Change the look, never the news. Small PRs, one idea each. Never push to
`main`. Run `python3 check.py` before you push. Full rules, including the ones
your AI must follow, are in [AGENTS.md](AGENTS.md).

## Getting started (humans)

1. Accept the invite to this repo. You need to be a collaborator, not a fork.
2. Install `git` and the GitHub CLI (`gh`), and sign in with `gh auth login`.
3. Clone it:

   ```bash
   git clone https://github.com/kdavis5111/htn-ui-lab.git
   cd htn-ui-lab
   ```

4. Open your AI agent (Claude Code, Codex, Cursor, whatever you use) inside
   that folder and paste the starter prompt below.
5. Look at the page yourself first. Run `python3 -m http.server 8000` and open
   http://localhost:8000/ . Try it at phone width. Toggle dark and light.

## Starter prompt for your AI

Paste this as your first message, then add your idea at the end.

```
You are working in the HeresThe.News UI Lab repo, a frozen copy of a real news
site that we are redesigning for a class project. Before doing anything else,
read AGENTS.md in the repo root and follow it exactly. Then read README.md.
Tell me in a few sentences what this repo is, what you are allowed to change,
and what you must never change. Wait for my go-ahead.

After I say go: create a branch named <myname>/<short-idea> from main, make the
change, run python3 check.py, show me a before and after (serve the page with
python3 -m http.server 8000 and screenshot it at 375px wide and at desktop, in
dark and light), and open a pull request with the template filled in. Do not
merge. Keep the change small and only about the look.

My idea: 
```

## Branch and merge rules

- One idea, one branch, one PR. Name it `firstname/short-idea`.
- Variation on someone's open idea? Branch from their branch, name it
  `firstname/short-idea-v2`, and say so in the PR.
- `main` is the team's proposed version of the real site. A PR merges when the
  check passes, the team agrees it is better, and Kendrick approves. Only
  Kendrick merges.
- Merged is not live. Kendrick ports `main` to the real site on his schedule.

## Files

| File | What |
|---|---|
| `index.html` | the frozen page |
| `style.css` | all styles, this is where most work happens |
| `app.js` | page script (theme, topics, share, collapsing bands) |
| `lab.css` | the green lab banner, leave it |
| `baseline/` | the untouched starting point, never edit |
| `check.py` | the rules check, run it before every push |
| `data/` | a real day's data file, read-only, so you can see what fields exist |

## Review checklist (for whoever looks at a PR)

- Is the news identical? (`check.py` says so, but look.)
- Does it look right at 375px?
- Dark and light both fine?
- Is it one idea? Could you describe it in one sentence?
- Would a regular reader notice this as better, or just different?

Content on the page is © HeresThe.News and its cited sources. This repo exists
for the class project only.
