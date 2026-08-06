# To Do

Working list for tidying up the project and its documentation.
Last updated: 6 August 2026.

---

## 1. Fixes to the guideline docs

All applied 6 August 2026, checked against the live pages. Both docs now live in `docs/`.

- [x] **Stylesheets.** Remove `button-shine.css` from the required list (the file no longer exists; the shine effect is in `base.css`). Required set is 4: `base.css`, `levels.css`, `activities.css`, `progress-tracking-styles.css`.
- [x] **Stylesheets, rule change.** Replace "always these five, no others" with: each page loads the stylesheets it needs — the 4 core sheets plus any activity-specific sheet (e.g. `compact-matching.css`).
- [x] **Add `defer`** to all four script tags in the guidelines, matching the live pages.
- [x] **Update the footer block** to the current one: Quick Links / Learn English / About, licence link inside the About column, Instagram link, bottom bar `© 2025–2026 English in Doses | All rights reserved`.
- [x] **Theme toggle:** add `aria-hidden="true"` to the ☀️ and 🌙 spans.
- [x] **Nav toggle:** add `aria-expanded="false"` to the hamburger button.
- [x] **Drag-and-drop count:** usually 5 questions, but the score denominator must always match the actual number of questions on the page. Same for the MCQ denominator. (This has caused bugs before — make it a bold rule, not a note.)
- [x] **MCQ options:** 3 options (A, B, C) as standard, unless specified otherwise for a particular page. Remove the "3 or 4, be consistent" wording.
- [x] **Final activity:** state that the MCQ is the standard final activity, but another activity type may be used when specified. Document the compact-matching alternative as an example (`.cm-*` markup, `compact-matching.css`, `compact-matching.js`, its own init call).
- [x] **Breadcrumbs:** replace the stale 6-anchor list with "use the actual section id from `advanced-grammar.html`".
- [x] **Review Grammar link:** confirm it is required on every grammar lesson page (with `id="summary"` as the target). Reference pages are outside these rules.

## 2. Page fixes found during the audit

- [x] `grammar/advanced/adverb-position.html:24` — remove the `button-shine.css` link (404). Done 6 Aug 2026.
- [ ] `grammar/advanced/compound-nouns.html` — Next button points to `complex-noun-phrases.html`, which doesn't exist yet. Either build that page or repoint the link.
- [ ] Add the missing Review Grammar link + `id="summary"` to `gerund-infinitive.html`, `subjunctive1.html`, `subjunctive2.html`, `subjunctive-revision.html`.
- [ ] Check every page's activity score denominators against the actual question counts.

## 3. Docs to write

Roughly in the order I'd tackle them.

- [x] **Move the guidelines into a `docs/` folder.** Done 6 Aug 2026 — both now live in `docs/`: `advanced-grammar-content-guidelines.md` (the what) and `grammar-page-html-guidelines.md` (the how).
- [ ] **Finish the `grammar-lesson-content` skill.** Our own skill, still in progress and still being tested. It writes the Markdown lesson body only — no HTML. It is the third guideline document in practice, so it needs to stay in step with `docs/advanced-grammar-content-guidelines.md`: when a rule changes in one, change it in the other. Decide whether the skill points at the docs or restates them.
- [ ] **`CLAUDE.md`** (after the tidy-up). Short: what the site is, folder map, hard rules (British spelling, no build step, no frameworks, edit HTML directly), and pointers to the guideline docs rather than repeating them.
- [ ] **Activity module reference.** The biggest gap. 20+ JS modules (`mcq`, `drag-drop`, `compact-matching`, `gap-fill`, `matching`, `word-gap-fill`, `spelling-scramble`, `flash-cards`, `odd-one-out`, `listen-choose`, `sentence-order`, `choose-correct`, `drop-down`, `vocab-match`, `random-questions`, `speaking-questions`…) with no record of each one's required HTML, its CSS file, or its `init()` options. Right now the only way to use one is to find a page that already does.
- [ ] **Shared blocks doc** — head, nav, footer. These are hand-duplicated across 44+ advanced pages and have already drifted (the old footer survives on one page). One canonical copy each, with a note that changing it means changing every page.
- [ ] **New-lesson checklist** — everything outside the page itself: add the card to `advanced-grammar.html`, use the right breadcrumb anchor, wire prev/next on both neighbouring pages, choose the `LESSON-SLUG`, register the progress-tracking IDs.
- [ ] **Progress-tracking doc** — the ID scheme (`mcq-<slug>`, `drag-drop-<slug>`, lesson `<slug>`) and how `my-progress.html` reads it. A wrong ID fails silently.
- [ ] **Beginner and intermediate guidelines.** Everything documented so far is advanced-only; `grammar/beginner/` and `grammar/intermediate/` have no written standard.
- [ ] **Reference page rules.** Pages like `gerund-infinitive-reference.html` don't follow the lesson rules. Decide what they do follow.

## 4. Tidy-up

- [x] Delete `grammar/advanced/advanced-grammar-explanation-template.html` (outdated, conflicts with the current guidelines).
- [x] Delete `files/README.md` (documented a folder structure that doesn't exist).
- [x] Delete the empty root `CLAUDE.md`.
- [x] Delete `files/` — leftovers from the original scaffold, nothing referenced them. Done 6 Aug 2026.
- [x] Clear out `grammar/advanced mass trial/`. Done 6 Aug 2026 — guidelines moved to `docs/`, the 6 drafts already built as pages deleted (recoverable from git history), the one unbuilt draft moved to `drafts/focusing-adverbs-and-adverbials.md`.
- [ ] Build the `focusing-adverbs-and-adverbials` lesson page from the draft in `drafts/`.
- [x] Drop the branch `claude/instagram-design-guidelines-NekT4` and its Instagram design guidelines / carousel generator work — not wanted. Done 6 Aug 2026: already deleted on GitHub, stale local tracking refs pruned (along with `update-dep-preps-full-table`), unreachable commits garbage-collected.
- [ ] Run a site-wide link check for other dead links and missing files.
