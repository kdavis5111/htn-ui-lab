# Revisions after the user test

The assignment asks for a copy of the tested prototype, a revised prototype,
and a list of changes that says whose analysis each one came from. This file
is that list.

| | Link |
|---|---|
| **Before** (what participants tested, Nov 10-11 2026) | https://kdavis5111.github.io/htn-ui-lab/pr/10/ (git tag `user-test-v1`) |
| **After** (the revised prototype, always the latest `main`) | https://kdavis5111.github.io/htn-ui-lab/ |

## Changes

Kendrick adds a row here when a pull request merges. Everyone else: put the
same facts in the "Why" part of your pull request.

| Change | From whose analysis | Finding it answers | PR |
|---|---|---|---|
| Search in the nav: a magnifier at the end of the nav row opens a field, and typing shows only the stories that mention the words | Kendrick (ease of finding) and Ben (draw your own conclusions) | Kendrick: finding things was rated about the same as people's current source (5.58 vs. 5.42 out of 7, p = 0.67), so we matched it but did not beat it. Participants said "there is no search bar on the homepage... a little inconvenient when looking for a specific news article" and "i must find the subject long time". Ben: his analysis found no specific problem to fix; a search bar was the one addition it pointed to. | [#13](https://github.com/kdavis5111/htn-ui-lab/pull/13), [#15](https://github.com/kdavis5111/htn-ui-lab/pull/15), [#17](https://github.com/kdavis5111/htn-ui-lab/pull/17) |
| Each story is its own card, section headings are larger, the "why it matters" text sits in a highlighted box, facts line up in a clean grid, and "show more" is a real button | Josh (satisfaction) | Many participants commented on the lack of visual satisfaction: "it is really plain and the UI is not that easy to follow", "it looks like website from the '90s", "many things have a bland design". | [#14](https://github.com/kdavis5111/htn-ui-lab/pull/14) |
| A short key above the feed explains the four claim labels (verified, reported, disputed, developing), and every headline row now says "Open" or "Close" | Ryan (concept comprehension) | Clearer interactions went with a better understanding of what the site is for (+0.72 points per point of interaction clarity, p = 0.001). The labels are the core idea of the site, and nothing told readers that a headline opens. | [#16](https://github.com/kdavis5111/htn-ui-lab/pull/16) |

## Tried and removed

A "Jump to" row of section links at the top of the feed (#12). It worked, but it added clutter to the top of the page, so it was removed and search moved into the nav (#15, #17).

## Who owes what

Each person makes at least the change their own analysis called for.

| Person | Outcome analyzed |
|---|---|
| Ben | Draw your own conclusions |
| Josh | Satisfaction |
| Ryan | Expectations vs. reality, concept comprehension |
| Kendrick | Ease of finding what you are looking for |
