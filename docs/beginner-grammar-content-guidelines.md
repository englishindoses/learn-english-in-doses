# Beginner Grammar Page: Content Guidelines

These guidelines describe the structure and content of every beginner grammar page on the English in Doses website. Follow them for all new beginner pages unless we decide otherwise.

**Reference page:** `grammar/beginner/adverbs-of-frequency.html` follows this model exactly. Copy its markup for new lessons, and copy `beginner-review-1.html` for new reviews. For general markup rules (class names, activity markup, init scripts), see `grammar-page-html-guidelines.md` in this folder.

**Who the lesson is for.** The learner is a beginner (A1–A2). Keep everything short, clear and easy to read.

**Length.** A lesson takes about 30 minutes, including the study sections and both activities. It doesn't need to cover every detail of a grammar point.

---

## Page Structure

Every lesson has these parts, in this order:

1. **Introduction:** 1–3 short sentences saying what the grammar is for, then exactly **3 easy-to-read objectives** under "After this lesson, you will be able to:".
2. **Grammar points:** split the topic into logical points (usually 3). Each point has:
   - **Form:** the structure as a clear formula, e.g. `subject + can / can't + base verb`.
   - **When to use it:** one short sentence. If "when" doesn't fit the point, use something similar (e.g. "Use these words to say where something is").
   - **3 examples.**
   - **An optional short note** for one key rule, spelling pattern or common trap.
3. **Activity 1:** 5 questions. Drag-and-drop sentence ordering.
4. **Summary table:** the whole lesson at a glance.
5. **Activity 2:** 8 questions. Multiple choice, with an explanation for both right and wrong answers.

Beginner pages built to this model have no Common Errors or Tips sections.

---

## Examples

- **Varied:** use different subjects (I, you, he, she, we, they, names, family words), verbs and situations across the page.
- **Suitable for the level:** use words a beginner knows, and no grammar the course hasn't taught yet.
- **Show the grammar point clearly:** highlight the grammar being studied, and keep the rest of the sentence as simple as possible.
- **Natural:** every example must be something people actually say. No textbook filler.
- **Everyday contexts:** daily life, work, routine, family, hobbies, travel.
- British English spelling throughout.
- No native speaker notes (see `CLAUDE.md`).

---

## Activities

- **Activity 1 (5 questions):** the learner drags words into the correct order. Keep each sentence to about 4–8 words. Mix positive sentences, negatives and questions where the lesson teaches them.
- **Activity 2 (8 questions):** multiple choice with 3 options. Each wrong option should be a mistake a beginner really makes, and never a second correct answer. Each question needs a short explanation for a right answer and for a wrong answer.
- The number of questions, the `/N` in the score display and the number of entries in the `answers` object must always match.

---

## Review Pages

There is a review at the end of each section of the course index. A review has:

1. **Introduction:** 1–2 sentences on what the review covers, and 3 objectives.
2. **Quick Reminder:** one table with a row per lesson in the section (lesson, what to remember, example).
3. **Activity 1:** 5 drag-and-drop questions, mixed across the section.
4. **Activity 2:** 10 multiple-choice questions, mixed across the section. The final review has 15.

---

## Course Order and Navigation

- `grammar/beginner/beginner-grammar.html` sets the lesson order. Each page's prev/next links follow it. The first lesson's "previous" link and the final review's "next" link go back to the course index.
- Progress tracking ids follow the site-wide pattern: `mcq-<slug>` and `drag-drop-<slug>`, where the slug is the file name without `.html`.

---

## Older Pages

These beginner pages were kept from before this model and have a different layout (Common Errors, Tips, longer quizzes): `be-verb.html`, `present-simple.html`, `prepositions-time-place.html`, `present-continuous.html`, `present-simple-vs-continuous.html`. Leave them as they are unless we decide to rebuild them.
