# Extra Practice app

A progressive web app of extra practice activities, built from the same
content as the rest of the site. It lives at `englishindoses.com/app/`.

This is the only part of the repository with a build step. Nothing here
changes how the lesson pages are served.

## The two commands

```
cd app-src
npm install     # once
npm run dev     # work on it
npm run build   # before committing
```

`npm run build` writes the finished app into `../app/`.

## Rules that are easy to get wrong

- **`../app/` is committed, and must never be hand-edited.** GitHub Pages
  serves straight from the branch, so the built folder has to be in the
  repository. Any edit made there is destroyed by the next build.
- **`base` in `vite.config.js` is `/app/`.** Change it and the app loads a
  blank page on the live site while working perfectly in development.
- **The app has its own stylesheet.** `src/styles/app.css` holds all of it.
  The layout follows the BizEng app; the fonts, colours and button shine are
  copied from `../css/base.css` and `../css/levels.css` into the tokens at the
  top of the file. A colour change on the website reaches the app only when
  those tokens are updated and the app rebuilt.

## Levels and colours

Every section in `src/data/topics.js` belongs to a level, and a topic takes
its level from its section. Screens for one topic (its activities, a practice
session, the results) are drawn in that level's colours. Every other screen
uses the website's default blue. The top bar is navy everywhere.

To add intermediate or advanced topics, add a section with that level, then
add topics to it. The colours follow with no other change. Section ids are
shared across levels, so an intermediate grammar section needs its own id,
such as `intermediate-grammar`.

## How it is put together

| Folder | What is in it |
| --- | --- |
| `src/data/` | The content. One file per topic, plus `topics.js` which lists levels, sections and topics in course order and holds the session constants. |
| `src/engines/` | One file per activity type, each exporting the same small interface. |
| `src/screens/` | One function per screen. |
| `src/lib/` | Router, DOM helper, question pool, dragging, install prompt, storage, account and cloud sync. |
| `src/ui/` | The shell (top bar and profile menu), dialogs, avatars, greetings, progress pieces, the install card. |
| `src/styles/app.css` | All the styling. |
| `tools/` | The content checker and the icon copier. |

Content is data, never markup: a topic file exports banks of questions, and
nothing in the engines or screens knows what the questions are about.

## Adding an activity type

One new file in `src/engines/`, and one line in `src/engines/index.js`.

Engines build the question and mark it right or wrong. The card around it, its
number, the Ask my teacher button and the feedback line belong to the session
screen, so every activity type looks the same.

A `per-item` engine builds one question at a time and returns
`{ node, isAnswered, check, onEdit }`. A `per-round` engine builds all four at
once and returns `{ node, feedbackNodes, isAnswered, blankCount,
highlightBlanks, check, onEdit }`, where `check` returns one result per
question and `onEdit` is told which question changed. Write the word is the
only per-round engine, because its word box covers all four sentences.

## Progress

An activity is twelve questions. Progress is counted in activities completed,
not questions seen, and each activity keeps its own unfinished attempt. The
headline score is the percentage of questions standing correct across every
completed activity, shown as a dash until the first one is finished. All of
this lives in `src/lib/storage.js`, which is the only file that touches saved
data. It also moves anything saved by the first version into the current
shape the first time the app opens.

## Sign-in

Students choose Google sign-in or guest on the first screen. Guests keep their
practice on the device. A signed-in student's practice is copied to Firebase
and follows them to any device, and the teacher's Google account
(`TEACHERS` in `src/lib/account.js`) sees a Your students page.

The Firebase settings go in `firebaseConfig` at the top of `src/lib/cloud.js`.
While they are blank, the Google button says sign-in is not switched on yet,
and guests are unaffected. Students are stored in the `practiceUsers`
collection.

## Checking the content

```
npm run check                  # every topic
npm run check present-simple   # one topic
```

It catches duplicate ids, an answer missing from its own options, a word order
alternative that cannot be built from the words on screen, two word bank
answers that share a word, and a clue that gives the answer away. Problems
exit non-zero; notes are things for a person to judge.

It does not read the English. Run grammar police for that.

## Still to do

- A proofreading page builder, for reading a whole topic on a phone.
- The remaining topic banks. Only Present Simple is written.
