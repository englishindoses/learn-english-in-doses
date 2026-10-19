# English in Doses: project guidance

## Scope and sources of truth

This is an ESL/EFL teaching website with a separate Extra Practice progressive web app. This file applies throughout the repository. Read the relevant code and linked guidance before making changes; do not treat all pages as interchangeable templates.

- `CLAUDE.md` records established project preferences. Preserve those preferences, but its claim that the entire repository has no build step predates the practice app.
- `docs/advanced-grammar-content-guidelines.md` governs advanced lesson content; `docs/grammar-page-html-guidelines.md` governs its markup. Read both before editing advanced lessons. Reference pages have a different structure.
- `docs/beginner-grammar-content-guidelines.md` governs beginner lessons and reviews. It names the canonical examples and older lessons that should retain their existing layouts. It supersedes older claims that beginner guidelines do not exist.
- There is no intermediate lesson standard. Ask about the required structure before building a new intermediate lesson.
- Before touching `students/tour-guide/`, read `students/tour-guide/CLAUDE.md` and its `curriculum-outline.md`. The course-specific instructions apply there; its statement that beginner guidelines do not exist is outdated for the main grammar course.
- `app-src/README.md` describes the practice app. `bizeng-build-spec.md` is background from the app that inspired it, not proof that every described feature exists here.
- `todo.md` records outstanding work. Check claims against current code: some entries are historical or stale. Keep it current when the task changes the status of an item; do not overwrite unrelated edits.

Keep detailed lesson rules in their existing documents rather than copying them into this file. When guidance conflicts, use the user's current instructions, then the applicable specific standard and current implementation; clarify unresolved product decisions.

## Architecture and deployment

### Main teaching website

- Plain HTML, CSS and browser JavaScript. No root package manager, framework, template compiler or build step. Edit the served files directly.
- `index.html` redirects to `home.html`, the actual homepage.
- GitHub Pages serves the committed website and built app, according to `app-src/README.md`. `CNAME` specifies `englishindoses.com`. The repository contains no GitHub Actions deployment workflow or infrastructure-as-code configuration; actual hosting settings are external.
- Page navigation, head elements and footers are copied between HTML files. A shared JavaScript or CSS change can affect many pages; changing one page's navigation does not update other pages.
- Asset and navigation paths depend on directory depth. Preserve existing filenames, case and public URLs. Windows may hide path-case errors that matter on hosting.

### Extra Practice app

- Author source in `app-src/`; serve the generated output from `app/` at `/app/`.
- Vanilla JavaScript ES modules, Vite 7, `vite-plugin-pwa` and Firebase. Dependency versions and scripts are in `app-src/package.json`, with the lockfile alongside it.
- **Never hand-edit `app/`**, including its assets, manifest and service worker. It is committed build output and is replaced by `npm run build`. Include regenerated output with source changes when preparing an app commit.
- Preserve `base: '/app/'`, the manifest scope and start URL in `app-src/vite.config.js`. The build writes to `../app` with `emptyOutDir: true`.
- The app uses hash routing (`src/lib/router.js`), so deep links need no server rewrite configuration.
- Service worker updates must remain user-triggered (`registerType: 'prompt'` and `src/lib/pwa.js`). An automatic reload can interrupt an unfinished activity.
- Offline app assets and Google Fonts caching are configured in Vite. Sign-in and cloud sync still depend on network services.

## Repository and feature map

| Location | Purpose |
| --- | --- |
| Root HTML | Homepage and level finder, beginner/intermediate/advanced landing pages, about, WhatsApp lesson enquiries, licence, grammar quiz and progress dashboard |
| `student-dashboard.html`, `js/student-dashboard.js` | Landing page after sign-in: confirmed student's greeting, started lessons, public course choices and shared progress/continuation sections |
| `css/student-dashboard.css` | Wide, responsive dashboard layout, scoped to `body.student-dashboard`; lesson widths and shared footer styling stay in their existing modules |
| `grammar/beginner/` | Beginner grammar course, section reviews and speaking questions; `temp/` contains additional older material, not a canonical template |
| `grammar/intermediate/` | Intermediate grammar index, lessons and quiz |
| `grammar/advanced/` | Advanced grammar course, reference pages and downloadable reference PDFs |
| `vocabulary/beginner/` | Numbers, days, months and seasons with interactive practice |
| `travel/beginner-travel/` | Travel course index; airport lessons and review in `Unit1/`, hotel material in `Unit2/`, plus textbooks, cheatsheets and teaching documents |
| `students/hb/` | Individual student lessons, worksheets and syllabus; the planned account-menu integration is not implemented |
| `students/tour-guide/` | Unlisted, self-contained beginner course with a course index, illustrated lesson and separate practice pages |
| `worksheets/` | Printable student and teacher revision pages |
| `css/`, `js/` | Shared design, navigation, theme, accounts, progress and activity modules |
| `images/` | Branding, favicons and lesson illustrations |
| `drafts/`, `docs/` | Unpublished lesson drafts and authoring standards |
| `app-src/src/data/` | Topic registry, course sections, session constants and question banks |
| `app-src/src/engines/` | MCQ, dropdown, word order, word bank and spelling scramble engines |
| `app-src/src/screens/` | Sign-in, home, levels, topics, activities, sessions, review, saved questions, progress, help, settings, profile and teacher student views |
| `app-src/src/lib/`, `src/ui/` | Router, question selection, storage, accounts, cloud sync, dragging, install support and shared interface |
| `app-src/tools/` | Content checker and icon copier |
| `.claude/` | Claude-specific local permissions and a Python static-server launch configuration; these are not Codex permissions or deployment configuration |

Main-site activities include MCQ, sentence ordering, matching, gap fill, dropdowns, flashcards, picture vocabulary matching, spelling, error correction, odd-one-out, listening and speaking prompts. `activity-nav.js` manages activity tabs, `confirm-unanswered.js` supports incomplete submissions, and `translate-toggle.js` switches authored English/Portuguese content using `data-pt` attributes. Read each module's actual markup and initialisation contract before using it.

## Main-site editing conventions

- Use British English and natural, useful example sentences. Match vocabulary and grammar to the learner's level.
- No native-speaker notes in beginner material anywhere, including vocabulary, travel and student courses.
- Reuse `css/base.css`, `css/levels.css`, `css/activities.css` and the necessary activity stylesheets. Do not invent page-specific class systems or add `<style>` blocks. Put necessary shared styling in the appropriate stylesheet.
- Preserve level body classes (`beginner-section`, `intermediate-section`, `advanced-section`) and their matching navigation indicators. Preserve light/dark themes, mobile navigation, skip links, labels, focus handling and print behaviour.
- Load only the modules and styles a page needs. Most site scripts expose globals through IIFEs and initialise on `DOMContentLoaded`; account code is an ES module dynamically imported by `core.js`. Do not convert loading conventions casually.
- Lesson HTML contains its own answers and module configuration. Verify question count, answer entries, score denominator, feedback and restart behaviour together. DOM IDs and selectors must agree with the module configuration.
- The relevant course index determines lesson order and breadcrumb category anchors. When adding a lesson, update the index and adjacent previous/next links as appropriate. Some course links intentionally target planned lessons; distinguish these from accidental missing assets or wrong destinations.
- Keep learner-visible text, metadata, headings, summaries and answer explanations consistent. Preserve the existing licence and attribution information.
- The site footer is styled only in `css/footer.css`, imported by both `css/base.css` and `css/home.css`. Keep its three sections in three columns on mobile; adjust font sizes and gaps in that shared module. Do not duplicate footer rules in page stylesheets or HTML.

## Accounts and progress: two separate systems

### Website

- `js/core.js` handles shared browser behaviours and dynamically loads `js/account.js` and its stylesheet on pages with the theme toggle.
- `js/account.js` uses Firebase Authentication from Google's CDN. The app uses the Firebase npm dependency. Both target project `english-in-doses` and use the same synthetic username email domain, `users.englishindoses.com`. Keep account identity rules and project configuration aligned across both implementations.
- Website progress is now managed by `js/website-progress.js` and `js/website-lesson.js`; read `docs/website-progress.md` before changing it. Each Firebase UID has its own browser cache/outbox; cloud data uses the separate `websiteProgress` field in `practiceUsers/<uid>`. App data is unchanged.
- Sign-in leads to `student-dashboard.html`, also linked from the account menu. Home always opens the public homepage, including for signed-in students; do not redirect them merely because they are already logged in. New accounts can use the dashboard without a student-folder mapping.
- `js/website-lesson-catalog.js` is generated from actual lesson HTML and course indexes. Run `python tools/generate-website-catalog.py` after adding lessons or changing activity counts/order. Load catalog, tracker and lesson adapter before `core.js` on new pages.
- Completion requires every activity on the page, independently of score. Practice counts use distinct local dates in the Monday–Sunday week and current calendar month. Restoring answers must not count as practice.
- `js/progress-tracking-module.js` still exposes `ProgressTracker` and `ProgressTrackingModule`, but delegates to the new tracker when present. Legacy page callbacks do not decide completion. Preserve path/activity IDs because they identify saved answers.

### Practice app

- `src/lib/storage.js` owns practice data, account namespaces, migrations, unfinished attempts, saved teacher questions, scores and practice days. Account code separately manages account/session metadata. Use the storage API rather than adding direct practice-data writes in screens or engines.
- `src/lib/account.js` manages guest/student state, cloud loading and synchronisation. `src/lib/cloud.js` uses Authentication and Firestore collection `practiceUsers`, keyed by user UID.
- Google, username/password and guest modes exist. Guests keep practice on the device; signed-in students sync practice. There is no password-reset workflow yet.
- Teacher navigation is controlled by `TEACHERS` in `src/lib/account.js`; teacher screens show student progress and saved questions. Client-side checks are not database authorisation. Firestore rules are not checked into this repository, so their deployed permissions cannot be verified from local code or comments.
- Do not add service credentials, personal student information or passwords to repository files. Public Firebase web configuration is not a server credential.

## Practice app content and interaction contracts

- `src/data/topics.js` registers levels, sections and topic order. Currently 13 beginner grammar topics have banks; travel topics are placeholders. Intermediate and advanced level definitions do not mean their banks are implemented.
- Topic content is data, not page markup. Stable question/topic/type IDs also connect saved progress and questions; preserve them when editing wording.
- A session has three rounds of four questions: twelve questions per activity. Each activity retains its own unfinished attempt. The headline score reflects standing correct answers across completed activities.
- `src/lib/pool.js` selects unseen questions before repeating a bank. Preserve its saved selection state and cycle behaviour.
- Engines register in `src/engines/index.js`. Read an existing engine and the session screen before extending the interface: per-item engines return `node`, `isAnswered`, `check`, `onEdit`; per-round engines also provide per-question feedback and blank handling. The session screen owns surrounding cards, feedback and Ask my teacher controls.
- All app styling lives in `src/styles/app.css`. Website and app design tokens are separate; a shared brand change requires deliberate updates to both.
- Run the content checker explicitly: it is **not** wired into the build script. It validates structural answer consistency, not the correctness or naturalness of the English.

## Unlisted student course rules

For `students/tour-guide/`, preserve all course-specific rules in its `CLAUDE.md`:

- Never add inbound links from public site navigation, landing pages, indexes or other lessons.
- Keep navigation, breadcrumbs and logo links within the course; footer is copyright only. Shared site assets are permitted.
- Every course page needs `<meta name="robots" content="noindex, nofollow">`. Unlisted URLs are publicly accessible, not access control.
- Keep personal details out. Lesson files and images use the two-digit lesson suffix and lesson-local folders.
- No progress modules or saved attempts. Disable persistence in page initialisation, not globally in shared modules; inspect `lesson-01/lesson01.html` for the current approach.
- The course layout is not settled. Ask about layout before building a new course page rather than applying the public grammar template.

## Working and verification

- Work in the existing checkout on `main`; do not create branches unless the user asks. Keep changes focused and preserve unrelated modifications. Inspect `git status` before and after work.
- Do not commit or push solely because this file was read. Follow the user's requested task and any explicit session authorisation; the older `CLAUDE.md` preference for direct commits does not make every task a publishing request.
- Stay inside this project unless the user points to another location. The user normally previews changes; do not launch a browser or server unnecessarily.
- Read/write text as UTF-8, particularly for Portuguese, emoji and punctuation. PowerShell's default decoding can display misleading corrupted characters.
- Main-site changes need no npm install or build. Check affected relative links, IDs, answer counts, initialisation and related navigation. For shared modules, consider all consuming page types, including student courses.
- App commands run from `app-src/`:

  ```text
  npm ci                          # install locked dependencies when needed
  npm run dev                     # development, when requested/needed
  npm run check                   # all question banks
  npm run check -- present-simple  # one topic
  npm run build                   # regenerate ../app/ after app changes
  npm run preview                 # inspect production build when needed
  ```

- On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`; do not change machine policy to run project commands. Use a Node version supported by the locked Vite dependencies.
- Website progress tests: `node --test tests/website-progress.test.cjs`; DOM tests require `npm.cmd install --prefix tools/test-browser`, then `node --test tests/website-lessons.test.cjs`. Set `ALL_LESSONS=1` to check every registered lesson. See `docs/website-progress.md`. Firebase is mocked in these tests; do not claim live sign-in or permissions were verified.
- There is no configured app unit-test or lint suite. App content checks and the production build serve different purposes.
- A documentation-only change does not need a production rebuild. Validate referenced paths and the final diff. Report checks performed and any relevant limitations.
- Baseline on 17 October 2026: `npm.cmd run check` passed for 720 questions across 13 topics. This is a historical baseline, not a substitute for rerunning checks after content changes.

## Known maintenance context

Consult `todo.md` for details: remaining work includes lesson navigation/index gaps, score-count audits, missing Review Grammar links, a site-wide link check, app travel banks, account testing, password recovery, website progress sync and personal student account links. These are not implicit instructions to fix unrelated features during another task.

Do not infer live infrastructure state from local comments. Hosting settings, Firebase provider configuration and deployed Firestore rules require separate verification when a task depends on them.
