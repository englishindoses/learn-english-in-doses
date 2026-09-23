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

## The links point inwards too

These pages do not link back out to the main site. There is no route in from
the site, so there is no route out either — this course is self-contained.

- The top nav holds course links only: the course `index.html`, the lessons
  and their practice pages. Do not copy the site nav onto a page here. The
  logo links to the course `index.html`.
- Breadcrumbs start at the course `index.html`, not at `home.html`.
- The footer is the copyright line only. No Quick Links, no About, no booking.
- Shared assets in `../../../css/`, `../../../js/` and `../../../images/` are fine —
  those are files, not navigation.

## Folders and file names

Each lesson has its own folder holding everything for that lesson: the lesson
page, its practice pages and its pictures. Every file name ends in the
two-digit lesson number.

```
students/tour-guide/
  index.html              course index, links to each lesson folder
  lesson-01/
    lesson01.html         the lesson
    practice01.html       practice index: one card per activity
    flashcards01.html
    words-pictures01.html
    word-order01.html
    gap-fill01.html
    matching01.html
    images/               river01.png, monkey01.png ...
```

Inside a lesson folder, the course index is `../index.html` and shared site
assets are three folders up: `../../../css/`, `../../../js/`,
`../../../images/`.

## The index

`index.html` lists the lessons. Each lesson is one `landing-paths-grid` row
holding exactly two `landing-path-card`s — the lesson on the left, its extra
practice on the right. Two cards per row is what makes the grid fall into two
columns, so don't put more in a row.

Both cards carry the lesson number and the lesson keeps its own title:
`Lesson 3: Giving Directions` and `Lesson 3: Extra Practice`.
The description under the title is a short topic label, not sentences —
"Greetings and Personal Information.", not a paragraph explaining the lesson.
The student is a beginner and has to be able to read the index itself.

## Images

Lesson images live in the lesson folder's `images/`, one file per word, named
after the word plus the lesson number: `waterfall01.png`, `monkey01.png`.
Square, around 300 x 300.
The page shows them in a 100px-tall box with `object-fit: contain`, so the
shape matters more than the exact size.

Vocabulary is presented with the carousel matching activity (`vocab-match.js`
and `vocab-match.css`), four pictures per carousel page. The word bank, the
`data-answer` on each drop zone, and the `/N` on the score must all agree.

## No progress tracking

These pages do not load the progress modules and do not use lesson slugs.
Scores show on the page and are not saved anywhere.

## These pages have their own layout

They are not built to the beginner lesson pattern, and there is no written
standard for beginner pages anyway. Do not copy the structure of a page in
`grammar/beginner/` and assume it fits, and do not apply the advanced
guidelines in `docs/` — those describe advanced grammar pages.

**The layout is not settled yet.** It will be written down here once the first
lessons exist and the shape is clear. Until then, ask before building a page
rather than inferring a pattern from whatever was built last.

## What stays the same as the rest of the site

- Lesson pages are three folders down (see Folders and file names), so
  shared assets are `../../../css/`, `../../../js/`, `../../../images/`.
- `<body class="beginner-section">`, and the matching
  `<div class="beginner-nav-indicator">` at the end of the nav.
- Load only the stylesheets and activity modules the page actually uses.
- Progress tracking is not used here (see above).

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
