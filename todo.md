# To Do

Working list for tidying up the project and its documentation.
Last updated: 30 October 2026.

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

- [x] **Advanced noun phrases sequence.** Removed the Generic vs. Specific Reference with Articles lesson. Built `abstract-quantifiers.html` and placed it after Compound Nouns — Part 2, before the planned Nominalisation lesson. Updated navigation and regenerated the website lesson catalogue. Done 22 October 2026.
  - Revised as **Advanced Quantifiers** on 27 October 2026: simplified explanations and objectives, corrected forms and highlighting, and rewrote quiz wording and feedback. Removed Important notes and recorded the note preference in the advanced content guidelines. Restored the user's three requested sections: quantifiers and meanings, common natural collocations, and nuance. Excluded “to some degree / extent” throughout.

- [x] `grammar/advanced/adverb-position.html:24` — remove the `button-shine.css` link (404). Done 6 Aug 2026.
- [x] `grammar/advanced/compound-nouns.html` — Next button pointed at a page that didn't exist. Done 25 Aug 2026: repointed to `compound-nouns2.html`.
- [ ] Add the missing Review Grammar link + `id="summary"` to `gerund-infinitive.html`, `subjunctive1.html`, `subjunctive2.html`, `subjunctive-revision.html`.
- [ ] Check every page's activity score denominators against the actual question counts.
- [ ] **Beginner lessons: check whether the `(= …)` explanations are useful.** Go through the bracketed explanation under each beginner example sentence and remove the ones that add nothing. Found 16 Sep 2026: *She is a nurse.* needed no explanation at all (removed from `articles.html`).

### Built but not on the index (24 August 2026)

Three finished lessons are missing from `advanced-grammar.html`. Check each one reads properly before adding it, then wire the prev/next chain around it.

- [ ] `passive-voice-summary.html` — belongs in module 4, Passive Voice. Has no prev/next buttons at all, Its `<title>` was copied from `passive-get-have.html` — fixed 17 Sep 2026, now "Passive Voice: Complete Summary". Still needs prev/next buttons and a place on the index.
- [ ] `multiple-adverbs.html` — belongs in module 7, after Adverb Position. Module 7 currently lists "Adverb Position and Multiple Adverbs" as one entry; split it into two. Nothing links to this page: `adverb-position.html` points its Next button at `adverb-position-fixed.html`, which does not exist.
- [ ] `dependent-prepositions2.html` — belongs in module 7, after Dependent Prepositions. Its Next button goes back to the index instead of on to Comment Adverbs.

Also worth deciding: `reporting-verbs-patterns.html` ends the Next chain by pointing back at the index, so nothing walks a learner from module 6 into module 7.

## 3. Docs to write

Roughly in the order I'd tackle them.

- [x] **Move the guidelines into a `docs/` folder.** Done 6 Aug 2026 — both now live in `docs/`: `advanced-grammar-content-guidelines.md` (the what) and `grammar-page-html-guidelines.md` (the how).
- [ ] **The `grammar-lesson-content` skill.** Deleted 12 August 2026 — a half-finished skill was more confusing than none. Rebuild it in one go when the time comes, not in pieces. It writes the Markdown lesson body only, no HTML, so it has to stay in step with `docs/advanced-grammar-content-guidelines.md`. Better still, have it point at that doc rather than restate it, so there is only one copy of the rules.
- [x] **`CLAUDE.md`** — written 6 Aug 2026. What the site is, folder map, pointers to the `docs/` guidelines rather than copies of them, site-wide conventions, working preferences. Deliberately says nothing about the grammar skill. Update it when the beginner/intermediate standards exist.
- [ ] **Activity module reference.** The biggest gap. 20+ JS modules (`mcq`, `drag-drop`, `compact-matching`, `gap-fill`, `matching`, `word-gap-fill`, `spelling-scramble`, `flash-cards`, `odd-one-out`, `listen-choose`, `fix-sentence`, `choose-correct`, `drop-down`, `vocab-match`, `random-questions`, `speaking-questions`…) with no record of each one's required HTML, its CSS file, or its `init()` options. Right now the only way to use one is to find a page that already does.
- [ ] **Shared blocks doc** — head, nav, footer. These are hand-duplicated across 44+ advanced pages and have already drifted (the old footer survives on one page). One canonical copy each, with a note that changing it means changing every page.
- [ ] **New-lesson checklist** — everything outside the page itself: add the card to `advanced-grammar.html`, use the right breadcrumb anchor, wire prev/next on both neighbouring pages, choose the `LESSON-SLUG`, register the progress-tracking IDs.
- [ ] **Commit rules.** Write down how commits should be made on this project, so they are consistent whoever (or whatever) writes them. Decide: message format and length, whether to use prefixes like `docs:` / `tidy:` / `fix:`, how much detail belongs in the body, how big a single commit should be (one lesson per commit? one concern per commit?), when to commit versus wait to be asked, and whether to always push straight after committing. Add it to `CLAUDE.md` or keep it in `docs/` and link it.
- [ ] **Progress-tracking doc** — the ID scheme (`mcq-<slug>`, `drag-drop-<slug>`, lesson `<slug>`) and how `my-progress.html` reads it. A wrong ID fails silently.
- [ ] **Beginner and intermediate guidelines.** Everything documented so far is advanced-only; `grammar/beginner/` and `grammar/intermediate/` have no written standard.
- [ ] **Reference page rules.** Pages like `gerund-infinitive-reference.html` don't follow the lesson rules. Decide what they do follow.

## 4. Tidy-up

- [ ] **Low priority — homepage quiz keyboard access.** Make answer choices keyboard accessible while preserving their current appearance and mouse/touch behaviour. Radio buttons previously caused problems; investigate those issues before choosing an implementation. Deferred by request on 30 October 2026.
- [ ] **Low priority — homepage image sizes.** Optimise homepage images, especially the approximately 13 MB `images/woman-with-speech-transp.svg` hero illustration, while preserving visual quality. Deferred by request on 30 October 2026.

- [x] Delete `grammar/advanced/advanced-grammar-explanation-template.html` (outdated, conflicts with the current guidelines).
- [x] Delete `files/README.md` (documented a folder structure that doesn't exist).
- [x] Delete the empty root `CLAUDE.md`.
- [x] Delete `files/` — leftovers from the original scaffold, nothing referenced them. Done 6 Aug 2026.
- [x] Clear out `grammar/advanced mass trial/`. Done 6 Aug 2026 — guidelines moved to `docs/`, the 6 drafts already built as pages deleted (recoverable from git history), the one unbuilt draft moved to `drafts/focusing-adverbs-and-adverbials.md`.
- [ ] Build the `focusing-adverbs-and-adverbials` lesson page from the draft in `drafts/`.
- [x] Build **Compound Nouns — Part 2**. Done 25 Aug 2026: `compound-nouns2.html` covers long noun strings, stress, and nouns from phrasal verbs. Added to `advanced-grammar.html` and wired into the prev/next chain.
- [x] Drop the branch `claude/instagram-design-guidelines-NekT4` and its Instagram design guidelines / carousel generator work — not wanted. Done 6 Aug 2026: already deleted on GitHub, stale local tracking refs pruned (along with `update-dep-preps-full-table`), unreachable commits garbage-collected.
- [ ] Run a site-wide link check for other dead links and missing files.

## 5. Practice app

- [x] Restyle the app in the BizEng layout, with the website's fonts, colours and button shine, and colours per level. Done 26 Sep 2026.
- [x] Bring over BizEng's progress counting (activities completed, answers correct, days practised this week) and its Google sign-in. Done 26 Sep 2026.
- [x] **Switch on sign-in.** Firebase project `english-in-doses` set up 27 Sep 2026, with Google and username and password. Connected to the app.
- [ ] Test Google and username sign-in on a phone, and check the Your students page.
- [x] Add Log in to the website's top bar, beside the theme toggle. Done 27 Sep 2026: `js/account.js` and `css/account.css`, loaded by `core.js`. Same accounts as the app.
- [x] Save website progress to the student's account. Implemented 17 October 2026: account-owned answers, all-activity lesson completion, weekly/monthly practice days and continuation links. See `docs/website-progress.md`.
- [ ] Verify website progress with real signed-in accounts on two devices and confirm the deployed Firestore owner/teacher permissions. Local automated checks use a test transport.
- [x] Add the student dashboard after sign-in, with a welcome, started lessons, course choices, progress and a next step. Implemented 17 October 2026.
- [ ] Decide how students reset a forgotten password. At the moment they need a new account.
- [x] Write the beginner grammar topic banks for the app. Done 28 Sep 2026: all 13 lessons on `beginner-grammar.html`, including Modal Verbs, which was missing from the app's list.
- [ ] Write the travel topic banks for the app.
- [ ] Proofread the new beginner grammar banks on a phone.

## 6. Personal student pages

Planned 10 October 2026. When a private student logs in, their account menu shows a **My lessons** link to their own folder in `students/`. Other students see their own link, or no link at all. The pages are not secret: anyone with the address can still open them, and that is fine.

- [ ] **A list in `js/account.js` matching students to folders.** Use each student's Firebase **User UID**, not their email, so no email addresses appear in the site's code. It works whether they log in with Google or a username. First entry: Hebert → `students/hb/`.
- [ ] **Show My lessons in the account menu** (beside My Progress and Practice app) only when the signed-in user is on the list.
- [ ] **An index page per student**, starting with `students/hb/index.html`, listing their lessons. Hebert has one so far: `week1-past-simple.html`. Add each new lesson to it.
- [ ] **Get Hebert's User UID.** He logs in to the website once, then copy it from the Firebase console: project `english-in-doses` → Authentication → Users → User UID column.
- [ ] **Check the Firebase database rules** so each signed-in user can only read and write their own data. A UID on its own gives nobody access to an account, but loose rules would let someone who knows it see or change that student's saved data.

Adding a student later: one line in the list, plus their folder and index page.

- [x] Hide routine saved-progress notices, add manual lesson completion, and align dashboard/course colours with the website. Done 22 October 2026.
