# Data shape

`edition-2026-09-23.json` is a real day's data file from the pipeline (a
different day than the frozen page, but the same shape). It is here so you can
see which fields exist before proposing a feature. Read only.

Each story has: `category`, `headline`, `facts` (each with a label of
verified / reported / disputed and the text), `impact`, `early` (true while a
story is still developing), `update_note`, and `sources` (name, url, lean).
If a feature needs a field that is not here, it needs pipeline support. Say so
in the PR instead of inventing it.
