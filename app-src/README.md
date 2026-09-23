# Extra Practice app

A progressive web app of extra practice activities, built from the same
content and the same look as the rest of the site. It lives at
`englishindoses.com/app/`.

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
- **`src/styles/site/` is copied from `../css/` on every build.** Do not edit
  those files. Edit the originals in `../css/` and rebuild. To add another of
  the site's stylesheets, add its name to the list in
  `tools/copy-site-css.js`.

## How it is put together

| Folder | What is in it |
| --- | --- |
| `src/data/` | The content. One file per topic, plus `topics.js` which lists them in course order and holds the session constants. |
| `src/engines/` | One file per activity type, each exporting the same small interface. |
| `src/screens/` | One function per screen. |
| `src/lib/` | Router, DOM helper, question pool, dragging, storage. |
| `src/ui/` | The shell (top bar) and the dialog. |
| `src/styles/` | `app.css` is the app's own chrome. `site/` is copied from the website. |
| `tools/` | The stylesheet copier. |

Content is data, never markup: a topic file exports banks of questions, and
nothing in the engines or screens knows what the questions are about.

The engines emit the website's own class names (`.question`, `.option`,
`.drop-zone`, `.feedback`), so the copied stylesheets style the activities
with no extra CSS. `app.css` deliberately does not restyle any of them.

## Adding an activity type

One new file in `src/engines/`, and one line in `src/engines/index.js`.

A `per-item` engine builds one question at a time and returns
`{ node, isAnswered, check, reveal?, onEdit }`. A `per-round` engine builds all
four at once and returns `{ node, feedbackNodes, isAnswered, blankCount,
highlightBlanks, check, onEdit }`. Word bank is the only per-round engine, and
it needs to be one because its word box covers all four sentences.

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
- Accounts. `src/lib/storage.js` is the only file that needs to change: the
  namespace becomes `eid.u.<uid>.` and writes also fire a sync listener.
