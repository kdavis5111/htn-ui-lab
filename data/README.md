# Data shape

`edition-2026-09-23.json` is a real day's data file from the pipeline (a
different day than the frozen page, but the same shape). It is here so you can
see which fields exist before proposing a feature. Read only.

Each story has:

- `category` (World, National, Business, ...)
- `headline`
- `facts`: a list, each with `text`, `status` (verified / reported / disputed)
  and `corroboration` (which sources back it)
- `impact`: the "why it matters" paragraph
- `early`: true while a story is still developing
- `update_note`: what changed since yesterday, or empty
- `sources`: a list of `source` name and `url`

The political lean shown on the page comes from a separate outlet list in the
pipeline, not from this file. If a feature needs a field that is not here, it
needs pipeline support. Say so in the PR instead of inventing it.
