# English in Doses — project notes

A static ESL/EFL teaching website. Plain HTML, CSS and JavaScript. **No build step, no framework, no package manager** — the `.html` files in this repo are exactly what gets served. Edit them directly and preview by opening the file.

Hosted from this repo (see `CNAME`). `index.html` is only a redirect to `home.html`, which is the real homepage.

---

## Folder map

| Path | What's in it |
|---|---|
| `docs/` | The guideline documents. Read these before building a lesson page. |
| `grammar/advanced/` | Advanced grammar lessons (~44 pages) plus `advanced-grammar.html`, the index. |
| `grammar/beginner/` | Beginner grammar lessons plus `beginner-grammar.html`. |
| `grammar/intermediate/` | Intermediate grammar lessons plus `intermediate-grammar.html`. |
| `travel/beginner-travel/` | Travel English course, organised into `Unit1`, `Unit2`… |
| `worksheets/` | Printable student/teacher worksheet pages. |
| `css/` | One core set plus one stylesheet per activity type. |
| `js/` | `core.js` plus one module per activity type. |
| `drafts/` | Lesson content written but not yet built as a page. |
| `images/` | Logo, favicons, page images. |
| `todo.md` | Running list of outstanding work. Keep it current. |

Root-level `.html` files are the site-wide pages: `home`, `about`, `license`, `booking-page`, `my-progress`, the three level landing pages, and `grammar-quiz-1`.

---

## Before building or editing a grammar page

Read both documents in `docs/` first. They were audited against the live pages on 6 August 2026 and are the source of truth:

- **`docs/advanced-grammar-content-guidelines.md`** — what to write. Structure, examples, activities, writing style.
- **`docs/grammar-page-html-guidelines.md`** — how to mark it up. Full page template, class names, activity markup, init scripts.

Do not restate their rules here or anywhere else; a second copy is a copy that goes stale. Link to them instead.

These cover **advanced** pages. There is no written standard for beginner or intermediate pages yet — **ask before building one** rather than inferring rules from an existing page.

---

## Site-wide conventions

- **British English spelling** in all learner-facing text.
- **Levels are set by a body class**: `beginner-section`, `intermediate-section` or `advanced-section`, which drives the colour scheme in `css/levels.css`. There is a matching `<div class="LEVEL-nav-indicator">` at the end of the nav.
- **Use the existing CSS classes.** They are defined in `css/base.css`, `css/levels.css`, `css/activities.css` and the per-activity stylesheets. Don't invent new class names or add `<style>` blocks to a page.
- **Each page loads only the stylesheets and scripts it needs** — the core set, plus the activity modules that page actually uses.
- **The level index page is the source of truth for lesson order.** `advanced-grammar.html` determines each lesson's previous/next links and its breadcrumb category. A prev/next link may point at a lesson that hasn't been built yet — that's expected, not a broken link.
- **Score denominators must match reality.** For every activity, the number of questions, the `/N` in the score display, and the number of entries in the `answers` object must be the same number. This has caused visible bugs before ("7/5").
- **Progress tracking** uses a per-lesson slug: `mcq-<slug>`, `drag-drop-<slug>`, and `<slug>` for the lesson itself. A mistyped id fails silently.

---

## Working preferences

- **Work directly on `main`.** Don't create branches. Edit, commit, push.
- **The user previews changes themselves.** No need to start a server or open a browser to verify.
- **Example sentences must be things people actually say.** No textbook filler, no waffly set-up.
- **Don't look outside this folder** unless pointed at something specific.
