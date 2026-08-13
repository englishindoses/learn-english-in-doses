# Advanced Grammar Lesson Guidelines

How to build an interactive advanced grammar lesson page for English in Doses.

Scope: the **interactive lesson pages** in `grammar/advanced/` — not the reference pages, the
PDFs, or the extra-practice pages in `extra-practice/`. Those follow their own patterns.

Where the live pages disagree with each other, this document wins. Where it is silent, follow
the most recently built lesson.

The learner is an advanced student. They are not meeting these structures for the first time;
they are learning to use them accurately and to choose between them. Write for someone who can
already hold a conversation.

---

## 1. The fixed shape of a lesson

Every lesson page uses the **same section order**. This does not vary.

| # | Section | Markup | Varies? |
|---|---|---|---|
| 1 | Title | `<h1>` | — |
| 2 | Introduction + objectives | `<section class="intro-section">` | — |
| 3 | Grammar points | `<section class="grammar-point">` | count varies |
| 4 | **First activity** | `<section class="content-section">` | type varies |
| 5 | Summary table | `<section id="summary">` | columns vary |
| 6 | Common Errors | `<section class="common-errors">` | — |
| 7 | Useful Tips | `<section class="tips">` | — |
| 8 | **Second activity** ("Test Your Knowledge") | `<section class="content-section mcq-container">` | type varies |

The order of the sections and activities must always stay the same, as described above.

Everything outside `<main>` — the nav, breadcrumbs, bottom navigation and footer — is
boilerplate. **Copy it verbatim from a recently built lesson page in this folder** and change
only:

- `<title>` and `<meta name="description">`
- the breadcrumb category link and the final breadcrumb text
- the previous/next links in `.bottom-navigation`

**The stylesheet links and script tags are not boilerplate — do not copy them blindly.** They
differ from lesson to lesson, and the files themselves change. Work them out from `css/` and
`js/` as described in §5.1.

Never write a `<style>` block. Never invent a class name. Every class you need already exists in
the `css/` folder; if you think you need a new one, go and look before assuming.

---

## 2. Section-by-section rules

### 2.1 Title and head

- `<title>` is `Topic Name - Advanced ESL Grammar`
- `<meta name="description">` is `Topic Name - Advanced ESL grammar explanation with examples and practice`
- `<body class="advanced-section">` and the `<div class="advanced-nav-indicator"></div>` at the
  end of the nav. Both are required — they drive the colour scheme.
- `<h1>` matches the lesson name used on `advanced-grammar.html`.

### 2.2 Breadcrumbs

Five items: Home › Advanced English › Advanced Grammar › *Category* › *This lesson*.
The category comes from the section heading the lesson sits under on `advanced-grammar.html`,
and links to its anchor there, e.g.
`advanced-grammar.html#noun-phrases-articles`.

### 2.3 Introduction and objectives

```html
<section class="intro-section">
  <h2>Introduction</h2>
  <p>…</p>

  <h3>After this lesson, you will be able to:</h3>
  <ul>
    <li>…</li>        <!-- exactly 3 -->
  </ul>
</section>
```

**The introduction is a couple of short sentences.** There is no exact number, but it is short.
It does two things and then stops:

1. Says what the topic is.
2. Says why we are covering it — why it matters to the student, what it lets them do, or what
   goes wrong without it.

No history of English, no "in this lesson we will", no warm-up. If it has run past four or five
lines, it is doing too much.

**Objectives — always exactly three.** The heading is `<h3>` and its wording is fixed:
**After this lesson, you will be able to:**

What the objectives say depends entirely on the grammar point and what it is used for. There is
no fixed list of opening verbs. *Understand* is fine, and so are *use, choose, tell, decide,
work out, avoid*. Understanding the rule and being able to use it **is** the goal. What matters
is the object of the verb:

- ✓ Objectives are about **understanding and using the grammar to communicate** — understanding
  what a form means, choosing between two forms, saying something with the right effect.
- ✗ Objectives are **never about the rule as an object of study**. Not "memorise the list of
  verbs", not "explain when the subjunctive is used", not "recognise inversion", not "identify
  the parts of a compound noun". The learner is not being trained to describe English grammar.

### 2.4 Grammar points

**How many grammar points there are depends on the grammar itself, not on a target number.** The
controlling constraint is that a single lesson must not be too heavy for one sitting.

- If the points are small and quick — one verb each, one adverb type each — it is fine to have
  more of them. A lesson built as a list can run to six or seven short sections.
- If each point needs real explanation, three to five is usually all one lesson can carry.
- If you find yourself writing a long lesson with many substantial points, **split it into two
  lessons** rather than shipping one heavy page. Several topics on the site already do this.

Judge it by the weight of the finished page, not by counting sections.

Each block follows the same internal order:

```html
<section class="grammar-point">
  <h2>1. Heading in Title Case</h2>

  <p><strong>Form</strong>: <span class="grammar-highlight">…</span> + …</p>
  <p><strong>When to use it</strong>: …</p>

  <div class="example">
    <ol>
      <li>Sentence with the <span class="grammar-highlight">target structure</span> marked.<br>(= plain-English gloss.)</li>
    </ol>
  </div>

  <div class="note">
    <p><strong>Native speaker note:</strong> …</p>
  </div>
</section>
```

Rules:

- **`Form` first, then `When to use it`.** Use `What it means` in place of `When to use it` only
  when the point is about meaning rather than choice of use. Do not invent other labels.
- The `Form` line shows the pattern, not a sentence. Wrap the moving parts in
  `<span class="grammar-highlight">`. Use `<br>` for a second pattern line.
- **Exactly one `<div class="example">` per grammar point**, containing an `<ol>` of **3**
  sentences. Every sentence gets a `<br>(= gloss.)` on the second line explaining what it means
  or why that form was chosen. The gloss is lower-case after `(=` and ends with a full stop
  inside the bracket.
- Highlight the target structure inside each example with `<span class="grammar-highlight">`.
  Highlight the structure only — not the whole sentence.
- Wrong forms inside prose go in `<s>` tags: `not <s>a very coffee table</s>`.
- A `<table>` inside a grammar point is fine when you are listing categories or patterns. Use a
  plain `<table>` with `<thead>`/`<tbody>`.
- Number the headings (`1.`, `2.`, …).

**Notes.** Each `<div class="note">` opens with a bolded label:

- `Native speaker note:` — what native speakers actually do, what they notice, what they avoid,
  how they actually use (or not) the grammar or how they express the same thing in real life
  (sometimes by not using the grammar).
- `Important:` — a restriction, an exception, or a rule that stops a predictable error.
- `Remember:` — a reminder of something taught earlier.

A native speaker note should be included with each section as long as there is something of
value to say — if there is no valuable note, don't include one for the sake of it. `Important:`
and `Remember:` notes should only be added if absolutely necessary and should not repeat what
has already been said.

**Comparison sections.** When a topic contrasts several forms, it is common for the last grammar
point to pull them together — headings in use include *Key Differences*, *Key Differences:
Choosing the Right Verb*, *Choosing Between the Two Tenses*, *X vs. Y*. There is no fixed format:
some are bulleted contrast lists, some are tables, some are paired examples with a `/` between
the two versions. Write whatever makes the contrast clearest. It is optional — a lesson that
teaches a single structure doesn't need one.

### 2.5 Summary table

```html
<section id="summary">
  <h2>Summary: Topic Name</h2>
  <table> … </table>
</section>
```

- `id="summary"` is **required** — the Review Grammar button in the final activity links to it.
- Heading is always `Summary: ` + the lesson name.
- 3 or 4 columns. Common shapes: *Form / Meaning / When to use it / Example*, or
  *Point / Rule / Example*.
- Every row must correspond to something actually taught above. The example cell uses
  `<span class="example">`, and forms in the first cell use `<strong>` +
  `<span class="grammar-highlight">`.
- This table is the revision aid. A learner who reads only this table should be able to do the
  final activity.

### 2.6 Common Errors

```html
<section class="common-errors">
  <h2 class="common-errors-heading">Common Errors</h2>

  <div class="error-pattern">
    <p class="error-title"><strong>1: Short name for the mistake</strong></p>
    <p class="incorrect">❌ The wrong sentence.</p><br>
    <p class="correct">✓ The right sentence.</p>
    <p class="explanation">Why, in one or two sentences.</p>
  </div>
</section>
```

- **Maximum three** `error-pattern` blocks, numbered `1:`, `2:`, `3:`.
- The `<br>` after the `.incorrect` line is part of the pattern — keep it.
- Use `❌` and `✓` exactly as shown.
- The two sentences must be **minimal pairs**: same sentence, one thing changed. Don't rewrite
  the whole sentence.
- These must be errors real learners make, not errors that are merely possible. They must also be errors that are common among English learners.
- `.explanation` is **plain text**. `<em>` renders as italics: use it only around words being
  quoted as words (*a/an*, *passers-by*), and `<strong>` (bold) for the one thing that must not
  be missed. **Never wrap the whole explanation in `<em>`.** Some older pages italicise the
  entire sentence, and then a word italicised inside it looks the same as everything around it,
  so the italics stop meaning anything.

### 2.7 Useful Tips

```html
<section class="tips">
  <h2 class="tips-heading">Useful Tips</h2>
  <div class="grammar-tip">
    <p>📌 <strong>TIP 1:</strong> …</p>
  </div>
</section>
```

- **Maximum three**, labelled `TIP 1`, `TIP 2`, `TIP 3`, each opening with the 📌 emoji.
- Tips are strategies, not rules — what to do when you're speaking and have no time to think,
  how to practise, what to write in a notebook, memory aids for the rules taught, etc. The rules are already in the summary table;
  don't repeat them here.

---

## 3. Activities

Two activities per page. The **second** one occupies the `Test Your Knowledge` slot at the
bottom; the **first** sits between the grammar points and the summary table.

### 3.1 Choosing the types

**First, look in `js/` and `css/` to see which activity modules currently exist.** Those two
folders are the only authoritative list. Do not rely on a list in this document, and do not
assume that whatever the last lesson you looked at uses is the full set — modules get added and
removed. There are more activity types on the site than the advanced grammar lessons currently
use, and one of them may suit your topic better than the familiar ones.

**The preferred pair is drag-and-drop sentence reordering first and MCQ last.** Default to those
two. They are only the default, though, not a rule — plenty of topics aren't about word order at
all, and forcing a reordering activity onto one of those wastes the slot. When they don't suit
the grammar, choose something that does.

Pick by what the grammar actually demands of the learner:

- **Producing the form themselves** — a typed gap fill, where nothing is given to choose from.
  The hardest and often the most useful at this level.
- **Choosing between a small closed set** — a drop-down gap fill, when the whole lesson is about
  picking the right one of three or four options.
- **Word order** — sentence reordering, when the lesson is about where things go in a sentence.
- **Form against meaning** — matching, when the skill is knowing what each form signals.
- **Anything** — multiple choice.

Whatever you choose, read the module's own file before you write the markup — it defines the
class names, the `data-` attributes and the init options that the activity needs. §3.3–3.7 below
describe the types the advanced lessons use today, but the module file wins over this document
if the two disagree.

### 3.2 Rules for every activity

- **Question counts**: MCQ is **10**. First activity can range between 5-8 questions. Final activity, if not an MCQ, can have 8-10 questions.
- **The denominator must match reality.** The number of questions in the HTML, the `/N` in
  `.score-display`, and the number of keys in the `answers` object must be the same number.
  This has shipped as a visible bug before ("7/5"). Count them before you commit.
- Order questions easy → hard.

**Buttons.** Every activity has a `<p>` instruction line under its `<h2>` and a
`.control-buttons` div containing:

- **Check Answers** (`.submit-btn`) — must work **every time it is pressed**, not only the
  first. If the learner changes an answer after checking and presses it again, both the feedback
  and the score must update to reflect the new answers.
- **Try Again** (`.restart-btn`) — clears the activity back to its starting state.

The **final activity** has those two plus a third:

- **Review Grammar** (`<a href="#summary" class="nav-button">`) — links to the summary table and
  is **visible at all times**, not revealed after scoring.

**Content.** Activity sentences follow the same realism rules as the examples (§4).

**Use fresh material.** Try not to reuse the example sentences from the grammar points. The
learner has just been given those answers, so testing them on the same sentences tests nothing —
and they are advanced learners who should be able to handle the structure with vocabulary they
haven't just been shown. Vary the words and the situations; repeating the same handful of
sentences down the page also makes the lesson feel repetitive. The odd recycled phrase is not
the end of the world, but it should be the exception.

### 3.3 MCQ

```html
<section class="content-section mcq-container">
  <h2>Test Your Knowledge</h2>
  <p>Choose the correct option for each question.</p>

  <div id="mcq" class="activity-container active">
    <div class="question" id="q1">
      <p class="mcq-question">1. Sentence with a _____ gap.</p>
      <div class="options">
        <div class="option" data-index="0"><span>A. …</span></div>
        <div class="option" data-index="1"><span>B. …</span></div>
        <div class="option" data-index="2"><span>C. …</span></div>
      </div>
      <div class="feedback"></div>
    </div>
    …
    <div class="control-buttons">
      <button id="mcq-submit" class="submit-btn">Check Answers</button>
      <button id="mcq-restart" class="restart-btn">Try Again</button>
      <a href="#summary" class="nav-button">Review Grammar</a>
    </div>

    <div class="score-display" id="mcq-score">Your score: <span>0</span>/10</div>
  </div>
</section>
```

- Question ids are `q1`…`q10`. `data-index` starts at 0 and matches the letter (A=0, B=1…).
- **3 options - you may use 4 if needed - make sure you stick to the same number for all questions on that page**
- Gaps are five underscores: `_____`.
- Every distractor must be a mistake someone would actually make. No filler options.
- Every distractor MUST be WRONG and should not be acceptable under any circumstances.
- The `Review Grammar` link is part of the button row and points at `#summary`.

**Question formats are open.** Gap-fills are the most common, but do not limit yourself to
formats already used on the site. Any format is fair as long as it tests the learner's ability
to **use** the grammar, and never their ability to recognise or repeat the rule itself. Never
ask "What is a compound noun?", "Which rule applies here?" or "What is this structure called?"

Formats that work: complete the sentence; which sentence is grammatically INCORRECT; which
sentence means X; which reply fits this situation; which of these would you say to a colleague.
Put the distinguishing word in capitals when the question turns on it.

**Feedback text** — both `correctExplanations` and `incorrectExplanations` are required, one
entry per question:

- Correct: state *why* it is right in one sentence. Recent pages open with "Correct." on some
  lessons and go straight to the reason on others; either is fine, but be consistent.
- Incorrect: **do not give the answer away.** Ask a question or point at the thing to check —
  "Your listener has not heard about this laptop before. Which article introduces something
  new?" This is the single most-broken rule when copying an old page; check it.

### 3.4 Drag and drop (sentence reordering)

```html
<div id="drag-drop" class="activity-container active">
  <div class="question" id="dd-q1">
    <p class="question-text">1. Put the words in the correct order:</p>
    <div class="drop-zone" data-index="dd-q1" data-answer="we waited at the bus stop"></div>
    <div class="drag-items">
      <div class="drag-item" draggable="true">stop</div>
      …
    </div>
    <div class="feedback"></div>
  </div>
```

- Ids and `data-index` are `dd-q1`…`dd-qN`. **The `dd-` prefix matters** — a plain `q1` collides
  with the MCQ ids on the same page.
- `data-answer` is **all lower case, no punctuation**, and must match the `answers` object in
  the init script character for character.
- `<div class="drag-item">` order in the HTML must be **shuffled**, not the answer order.
- 5–8 words per sentence at the start, growing to 7–9 by the last question.
- Instruction line can add a hint about what to watch for ("Remember: the main word goes last").

### 3.5 Gap fill (typed)

```html
<div class="question" id="gf1">
  <p class="gap-fill-sentence">1. I'll never forget <input type="text" class="gap-input" data-answer="meeting" placeholder="(meet)"> the Queen.</p>
</div>
```

- Ids `gf1`…`gfN`. The `placeholder` gives the prompt (usually the bare verb in brackets).
- Where more than one answer is acceptable, comma-separate them in `data-answer`:
  `data-answer="travelling,traveling"`. Include the US spelling as an accepted variant even
  though the lesson text is British English.
- Only use typed gap fill when there is exactly one obvious form the learner should produce.

### 3.6 Drop-down gap fill

```html
<div class="dropdown-sentence">
  <span class="sentence-number">1</span>
  <select class="gap-dropdown" data-answer="none" aria-label="Article for sentence 1">
    <option value="" disabled selected>Choose...</option>
    <option value="a">a</option>
    …
  </select>
  rest of the sentence.
</div>
```

- The container needs an id (`dropdown-<topic>`) and a matching feedback div
  `<div id="dropdown-<topic>Feedback" class="feedback"></div>`.
- Every `<select>` gets an `aria-label`, and the same option list in the same order.
- First option is always the disabled `Choose...` placeholder.
- Buttons are wired by hand (see §5.3) — this module has no `init()`.

### 3.7 Matching

- Three columns: `.cm-statements` (numbered items), `.cm-markers` (draggable numbers),
  `.cm-answers` (meanings, **shuffled** — `data-match` values must not run 1,2,3…).
- Container id is `cm-<slug>`, feedback div is `cm-<slug>-feedback`.
- The instruction line must mention the touch alternative: "On a touch screen, tap a marker and
  then tap its meaning."

---

## 4. Writing style

- **British English** throughout: *practise* (verb), *organise*, *aeroplane*, *learnt*, *travelling*.
- **Examples must be things people actually say.** A bus you'd catch, an email that didn't
  arrive, a flight that was late, a report due tomorrow. No *John gives Mary the book*, no
  invented characters, no set-up sentences that exist only to host the grammar.
- Examples must always show clearly the structure they represent.
- Be a little imaginative and use a variety of examples from every day life, work and travel. Try to avoid cliches and sentences that are not useful, like "the book is on the table".
- Address the learner as **you**. Never "the student" or "one".
- Short sentences. Explain the rule, then stop. If a paragraph runs past four lines, cut it.
- Use `<em>` for cited words and forms (*a/an*, *the*, *bus stop*), `<strong>` for the thing the
  learner must not miss. Don't use both on the same phrase.
- `<span class="grammar-highlight">` is for the target structure in examples, form lines and
  summary tables — not for emphasis in prose.
- Terminology is minimal and always explained on first use. Countable, uncountable, gerund,
  infinitive are fine. Anything narrower gets a plain-English gloss.
- Contractions are fine and preferred — this is spoken-register teaching English.

---

## 5. Scripts and progress tracking

### 5.1 Load only what the page uses

**Look in `css/` and `js/` and work out what this page needs. Don't copy a script block from
another lesson and hope.** Files get added, renamed and deleted; another page's list reflects
what was true when that page was built, not what exists now.

The page loads:

1. **The core set** — the stylesheets and scripts every lesson needs (the base and level styles,
   the activity styles, the progress-tracking pair, and `core.js`). Take these from a recent
   lesson page, then confirm each file still exists in `css/` or `js/`.
2. **Plus only the modules for the two activities this page actually uses** — nothing else.

For each activity, check whether it has **its own stylesheet as well as its JS module**. Some do
and some don't: several modules are styled entirely by the shared activity stylesheet, while
others have a matching file of the same name in `css/`. Look rather than guess — a missing
stylesheet gives you an unstyled activity, and an unused one is dead weight.

Two failure modes to check for before committing:

- A module left in the list for an activity this page doesn't have (usually left over from
  copying another lesson).
- An activity whose stylesheet exists in `css/` but wasn't loaded.

### 5.2 The slug

Pick one slug for the lesson — the filename without `.html` — and use it everywhere:

- lesson progress id: `<slug>`
- MCQ activity id: `mcq-<slug>`
- drag and drop activity id: `drag-drop-<slug>` and `storageKey: '<slug>'`
- gap fill: `gap-fill-<slug>` · matching: `matching-<slug>`

A mistyped id **fails silently** — nothing breaks, the progress just never records. Check it.

### 5.3 Init script

Goes at the very bottom of `<body>`, inside one `DOMContentLoaded` listener, commented
`<!-- Activity Initialisation -->`.

**Read the module file in `js/` before writing its init call.** Each module defines its own
global name and its own set of options, and they are not consistent with each other — some take
a `containerId`, some don't; some take a `storageKey`; one has no `init` at all. The example
below is the MCQ as it works today. Treat it as a shape to follow, and check the actual options
against the module.

```js
document.addEventListener('DOMContentLoaded', function() {
  MCQModule.init({
    containerId: 'mcq',
    answers: { 'q1': 1, … },
    correctExplanations: { 'q1': "…", … },
    incorrectExplanations: { 'q1': "…", … },
    showAllQuestionsAtOnce: true,
    onComplete: function(score, total) {
      console.log(`MCQ completed with score: ${score}/${total}`);
      if (typeof ProgressTracker !== "undefined") {
        ProgressTracker.markItemCompleted('activities', 'mcq-<slug>', {
          score: score, maxScore: total, completed: true,
          completedAt: new Date().toISOString(),
          title: "<Lesson Name> Practice"
        });
        ProgressTracker.updateItemProgress('lessons', '<slug>', {
          lastViewed: new Date().toISOString(), progress: 100,
          title: "<Lesson Name>"
        });
      }
    }
  });
});
```

- `showAllQuestionsAtOnce: true` on every MCQ.
- **`updateItemProgress('lessons', …)` appears exactly once per page** — in the `onComplete` of
  whichever activity sits in the bottom slot. The other activity only calls
  `markItemCompleted`. Two lesson updates on one page is a bug.
- `DragDropModule.init` needs `containerId`, `storageKey` and `answers`; matching's
  `CompactMatchingModule.init` takes only `onComplete`.
- The drop-down module has no `init` — wire it manually:

```js
document.getElementById('dropdown-check')
  .addEventListener('click', function() { checkDropdownAnswers('dropdown-<topic>'); });
document.getElementById('dropdown-restart')
  .addEventListener('click', function() { resetDropdownActivity('dropdown-<topic>'); });
```

---

## 6. Linking the lesson up

`advanced-grammar.html` is the source of truth for lesson order.

1. Add the lesson to the right category on `advanced-grammar.html`.
2. Set this page's breadcrumb category to that category's anchor.
3. Set `.bottom-navigation` prev/next from the neighbours in that list:
   `← Previous: Full Lesson Name` and `Next: Short Lesson Name →`.
4. Update the **next** link on the previous lesson and the **previous** link on the next one.

A prev/next link may point at a lesson that doesn't exist yet. That's expected — it's how the
sequence gets built out, not a broken link.

---

## 7. Pre-commit checklist

**Structure**

- [ ] All eight sections present, in the order in §1, with the activities in slots 4 and 8
- [ ] Introduction is a couple of short sentences — what the topic is, why it matters
- [ ] Exactly 3 objectives, about using the grammar, never about the rule itself
- [ ] Exactly 3 example sentences in every grammar point, each with a `(= gloss.)`
- [ ] No more than 3 common errors and no more than 3 tips — and none written just to fill a slot
- [ ] Lesson isn't too heavy for one sitting; if it is, split it into two lessons
- [ ] Every grammar point has Form and When to use it
- [ ] `id="summary"` present and the Review Grammar link points at it

**Notes**

- [ ] Native speaker notes say how people really use or avoid the structure, not the rule again
- [ ] No `Important:` or `Remember:` note that repeats something already said

**Activities**

- [ ] Question count = `/N` in the score display = number of keys in `answers`, for **both**
- [ ] Check Answers re-scores correctly on a second press after answers change
- [ ] Try Again on both activities; Review Grammar on the final one, always visible
- [ ] Activity sentences use fresh vocabulary, not the example sentences from the lesson
- [ ] Every question tests using the grammar, not naming or reciting the rule
- [ ] Every distractor is genuinely wrong, and wrong in a way a learner would fall for
- [ ] `correctExplanations` and `incorrectExplanations` cover every question
- [ ] Incorrect feedback hints, never states the answer
- [ ] Drag-and-drop `data-answer` strings are lower case and match the `answers` object exactly
- [ ] Drag items are shuffled; matching answers are shuffled

**Plumbing**

- [ ] `css/` and `js/` were actually checked for this page, not copied from another lesson
- [ ] Every stylesheet and script tag on the page points at a file that exists
- [ ] Only the modules this page's two activities use are loaded — no leftovers
- [ ] Each activity's own stylesheet loaded, where it has one
- [ ] Init options match what the module file actually accepts
- [ ] Slug identical in every progress id; `updateItemProgress('lessons', …)` appears once
- [ ] Nav, breadcrumbs and footer copied verbatim from a recent lesson
- [ ] Breadcrumb category, prev/next links, and `advanced-grammar.html` all agree
- [ ] British spelling; no `<style>` block; no invented class names
