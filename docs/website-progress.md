# Website progress

The lesson website saves progress for signed-in students. The Extra Practice app remains separate and is unchanged by this feature.

## Student dashboard

`student-dashboard.html` is the landing page after Google or username sign-in. Signed-in students returning to the public homepage are also taken there; opening a lesson while already signed in keeps that lesson open. **My Dashboard** is available in the account menu. `js/student-dashboard.js` adds the confirmed student's greeting and started lessons, while `js/my-progress.js` supplies the shared progress and continuation sections.

New students can browse five public courses immediately, with no UID mapping required. No other student's private lesson folder is assigned or advertised. Individual course assignments can be added later when the student's Firebase UID exists. The dashboard is hidden until an account is confirmed; signing out clears its student content.

## Behaviour

- Answers are saved as they change, including unfinished exercises.
- An activity is completed after every question has an answer and the student checks it. Incorrect answers count as attempted; scores remain separate from completion. Blank submissions do not complete an activity.
- Matching is complete when every pair is matched. Flashcards are complete after every card has been viewed. Speaking checklists must be ticked; ungraded speaking/role-play tasks have a **Mark as practised** button.
- A lesson is complete when all its registered activities are complete. Retrying an exercise does not remove an earned completion. Resetting website progress removes answers and completions.
- Practice days count distinct dates on the student's local calendar: Monday to Sunday for this week, and the current calendar month. Viewing a page or restoring saved answers does not count as practice.
- **My Progress** shows the last lesson worked on, its completed activities and either a continuation link or the next built lesson in its course index. Personal student pages appear in progress only after the student has worked on them.
- Signed-out students can practise but their new answers are not saved. Switching accounts reloads the page to clear the previous student's answer controls and module state.

## Files

- `js/website-lesson-catalog.js`: generated registry of actual activities and course order.
- `tools/generate-website-catalog.py`: builds that registry from HTML. Run `python tools/generate-website-catalog.py` from the repository root after changing activity counts, adding lessons or changing course order. This is a maintenance tool, not a website build step.
- `js/website-progress.js`: account state, calendar counts, local cache/outbox and conflict-safe cloud merge.
- `js/website-lesson.js`: saves/restores plain answer values and movable items using existing activity controls. It does not save or execute HTML.
- `js/account.js`: confirms identity and supplies the Firebase transport.
- `js/my-progress.js` and `my-progress.html`: dashboard.
- Existing `ProgressTracker` calls remain compatible, but the new tracker alone decides completion. Handwritten legacy completion callbacks cannot prematurely complete a lesson.

All regular pages load catalog, tracker and lesson adapter before `core.js`. When adding a page, preserve this order. The tour-guide course deliberately retains its separate no-persistence rules and does not load these scripts. Drafts in `grammar/beginner/temp/` are outside the registry.

## Storage and sync

Each confirmed Firebase UID has its own `eid.website.v2.<uid>` local cache, including pending changes. Blocked browser storage falls back to the current page's memory and displays a notice. Avoid closing the page before online saving finishes in that situation.

Website cloud data is stored as the `websiteProgress` JSON field on the existing Firestore document `practiceUsers/<uid>`. Transactions update only that field with `merge: true`; no app fields are replaced. The first read must succeed against the server before any queued upload is allowed. Failed reads/writes retain the outbox and show Retry. Reconnection also retries.

Uploads merge changed answer positions into the current server record, preserving other questions and lessons from another device. If two devices change the same answer, the last accepted transaction wins. Practice dates are combined. A reset increments an epoch so old offline queues cannot bring back deleted work. Firestore subscriptions refresh the local data; current answer controls are restored when opening the lesson, rather than being redrawn underneath a student who is typing.

Firestore permissions are managed outside this repository. Before publishing, verify that the existing `practiceUsers/{uid}` rules allow the owner to read/create/update their record (including `websiteProgress`), deny other students, and preserve the intended teacher access. Client-side UID checks are not a substitute for those rules. No Firebase configuration or rule deployment is performed by these files.

## Existing browser progress

Old shared browser data is not automatically assigned to an account and is never deleted by the new tracker. **Import old browser answers** explicitly imports compatible per-page MCQ selections into the signed-in account, without overwriting existing account answers or inventing practice dates. Ambiguous older formats remain untouched; they cannot safely identify their owner or lesson. Import is optional and repeat-safe.

## Checks

```text
node --test tests/website-progress.test.cjs
npm.cmd install --prefix tools/test-browser
node --test tests/website-lessons.test.cjs
node --test tests/website-account.test.cjs
```

For all registered lessons in PowerShell:

```powershell
$env:ALL_LESSONS='1'
node --test tests/website-lessons.test.cjs
Remove-Item Env:ALL_LESSONS
```

The DOM tests execute the real lesson scripts and page initialisers, check answers, save, reopen and restore each page. Firebase is replaced by a test transport; these tests do not prove deployed rules, actual Google sign-in or production network behaviour.
