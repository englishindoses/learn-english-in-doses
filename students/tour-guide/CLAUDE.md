# Tour guide English — private student lessons

One-to-one lessons for a beginner student who needs English for his work as a
tour guide. These pages live on the site but are **not part of the site**.

Read the root `CLAUDE.md` first. Everything there still applies — British
spelling, existing CSS classes only, no `<style>` blocks, score denominators
matching reality. This file covers only what is different here.

---

## Never link to this folder

Not from the nav, not from `home.html`, not from `beginner-landing.html`, not
from any index or landing page, not from another lesson's prev/next.

The student reaches these pages by typing or bookmarking the URL. That is the
only route in, and it is the entire point. A single stray link undoes it, and
nothing will warn you.

Add `<meta name="robots" content="noindex, nofollow">` to the head of every page
in this folder.

## These pages have their own layout

They are not built to the beginner lesson pattern, and there is no written
standard for beginner pages anyway. Do not copy the structure of a page in
`grammar/beginner/` and assume it fits, and do not apply the advanced
guidelines in `docs/` — those describe advanced grammar pages.

**The layout is not settled yet.** It will be written down here once the first
lessons exist and the shape is clear. Until then, ask before building a page
rather than inferring a pattern from whatever was built last.

## What stays the same as the rest of the site

- Depth is two folders down, same as `travel/beginner-travel/`, so shared
  assets are `../../css/`, `../../js/`, `../../images/`.
- `<body class="beginner-section">`, and the matching
  `<div class="beginner-nav-indicator">` at the end of the nav.
- Load only the stylesheets and activity modules the page actually uses.
- Progress tracking uses per-lesson slugs the same way: `mcq-<slug>`,
  `drag-drop-<slug>`, and `<slug>` for the lesson. Progress is localStorage,
  so it stays in the student's own browser.

## Content

Beginner level, and everything is tied to the job: greeting a group, giving
directions, times and prices, describing a place, handling questions and
problems on a tour. Examples must be things a guide would really say to real
tourists.

`travel/beginner-travel/` covers neighbouring ground and is worth checking for
reusable material before writing anything new.

## Nothing personal in these files

The folder is unlisted, not private — the repo is public and so is the site.
No surname, no contact details, no notes about the student. Lesson content only.
