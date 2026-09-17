# Grammar and language check — English in Doses

**Date:** 15 September 2026
**Scope:** all 98 `.html` pages (site pages, beginner/intermediate/advanced grammar, travel, worksheets) plus the question banks in `js/homepage-quiz.js` and `grammar-quiz-1.html`.

**A note on the tool.** The `grammar-police` MCP tool was run over the site content. It does not analyse text — it returns whatever it is sent, unchanged. What it carries is a set of instructions for how to check (report `original → corrected`, ignore capitalisation and punctuation). So the checking below is mine. I have deliberately **not** followed its "ignore capitalisation" rule, because on a site that teaches capitalisation, a lowercase `i am` is an error, not a style choice.

Points are numbered for reference. Sections are ordered by how visible the problem is to a learner.

---

## A. Wrong English on the page

### 1. ~~`i` written in lower case throughout the be-verb lesson~~ — DONE

`grammar/beginner/be-verb.html` lines 145, 173, 194–196, 280, 286, 292, plus the summary-table rows.

Examples as they appear to a learner: `i am a teacher.`, `i am not tired.`, `am i late?`, `she is happy.`, `they are from Spain.`, `Correct: ✓ i am a teacher.`

Two problems: the pronoun `I` is lower case, and the example sentences start in lower case. This directly contradicts `grammar/beginner/subject-pronouns-be.html`, which tells learners *"'I' is always a capital letter, even in the middle of a sentence."*

**Fix:** capitalise `I` everywhere, and capitalise the first word of each example sentence.

**Done.** Full sentences now start with a capital; the short-form list (`am not (no short form)`, `is not = isn't`, `are not = aren't`) and the summary-table fragments were left in lower case as fragments, with only the pronoun `I` capitalised.

### 2. ~~"The task needs completed." is keyed as the correct answer~~ — DONE

`js/homepage-quiz.js` line 223 — advanced level test.

Options are `completed / complete / completing / been completed`, with `correctAnswer: 0` → the test marks **"The task needs completed"** right. That is not standard English; it should be *needs completing* or *needs to be completed*.

It also contradicts your own lesson: `grammar/advanced/passive-verbals.html` Q4 lists *"The car needs washed"* as the **incorrect** option.

**Fix:** change `correctAnswer` to `2` (`completing`).

**Done.** `correctAnswer` is now `2`, so *The task needs completing* is marked correct.

### 3. ~~"I much like pizza." is keyed as the correct answer~~ — DONE

`js/homepage-quiz.js` line 72 — beginner level test.

`"I ____ like pizza."` with options `very / much / many / a lot` and `correctAnswer: 1` produces *"I much like pizza"*, which no one says.

**Fix:** rewrite the item, e.g. `"I like pizza very ____."` → `much`, or drop it. Compare `grammar-quiz-1.html` Q42, which handles this correctly: *"I like pizza very much."*

**Done.** Option `much` replaced with `really`, giving *I really like pizza.* The keyed index is unchanged.

### 4. ~~Subject–verb agreement in the do/does feedback messages~~ — DONE

`grammar/beginner/do-does-questions.html` lines 183, 239 (and the matching `data-fb-wrong` on the same elements).

The learner sees: **"Your friends is more than one, so you need Do."** and **"Your cousins is more than one, so you need do."**

On a page whose whole subject is do/does agreement, printing *"Your friends is"* teaches the opposite of the lesson.

**Fix:** *"'Your friends' is more than one person, so you need Do."* or *"Your friends are more than one person…"*

**Done.** Single quotation marks, not double: these strings live inside `data-fb-correct="…"` / `data-fb-wrong="…"` attributes delimited by double quotes, so a double quote would close the attribute early and break the markup. Single quotes are safe there and need no entity escaping. All 28 feedback attributes re-checked and parse cleanly.

### 5. ~~"We takes" / "You takes" in the same feedback messages~~ — DONE

`grammar/beginner/do-does-questions.html` lines 254, 537, 561, 569, 578.

Learners see **"We takes Do."**, **"You takes Do."**, **"You takes one word."** Even read as talk-about-the-word (*the word "we" takes Do*), it reads as an agreement error on an agreement page.

**Fix:** *"The subject we takes Do."* or *"With you, use Do."*

**Done.** Same single-quote treatment as point 4 — `'We' takes Do.`, `'You' takes Do.`, `'Anyone' and 'she' are one person`. The `Your phone` item in the same activity was quoted too, so the whole activity is consistent.

### 6. ~~"What place will you sleep?" — immigration flashcard~~ — DONE

`travel/beginner-travel/Unit1/airport-lesson3.html` line 320.

This is given as the officer's simpler rephrasing of *"Where will you stay?"*, but it is not grammatical.

**Fix:** *"Where will you sleep?"*

**Done.** Card 3 now reads *Where are you staying?* with the meaning *Where will you sleep?*

**Done — rest of the lesson brought into line.** *Where will you stay?* no longer appears anywhere in `airport-lesson3.html`. Changed: the matching activity statement, the model conversation, both conversation data blocks in the script, both MCQ stems, the grammar tip (which now quotes a question that is itself in the present continuous, reinforcing the lesson's grammar point), one MCQ explanation that echoed *where you will stay*, and the two role-play instruction cells (*where they are staying*). `travel/beginner-travel/Unit1/unit-1-overview.md` described the old question, so that was updated too.

The matching activity keys answers by marker number rather than by question text, so the change is safe, and the page's inline JavaScript was syntax-checked after the edit.

### 7. ~~"Neither A or B are correct."~~ — DONE

`grammar/advanced/double-passive.html` line 429, option C.

Should be *"Neither A nor B is correct."* — wrong correlative and wrong number, in an advanced exercise.

Context, for the record: this is Q5, *"Which sentence correctly uses a passive relative clause?"* Option C is the malformed one, but the keyed answer is **D ("Both A and B are correct")** — A and B are the full and reduced forms of the same passive relative clause, and both are genuinely correct. C is a distractor only, so no learner who answers correctly ever depends on it.

**Done.** Now reads `C. Neither A nor B are correct.`

**Still open — your call.** I flagged two faults and you fixed one. The number is still plural: with two singular items joined by *nor*, standard agreement is singular — *Neither A nor B **is** correct.* Plural is common in speech but would be marked wrong in Cambridge or IELTS writing, which is the audience this page names. Say the word and I'll change *are* to *is*.

### 8. ~~"She had no choice except to have trusted him."~~ — DONE

`grammar/advanced/perfect-infinitives-gerunds.html` line 249.

This is offered as a *correct* model of "except + perfect infinitive". It is not idiomatic English. The rule above it (line 52: *"for/except/instead of + to have + past participle"*) is doubtful as stated.

**Fix:** replace with *"She had no choice but to trust him"*, and reword or drop the rule.

**Done.** The whole "perfect infinitive after a preposition" claim is gone: the section is now headed *Perfect Gerunds with Prepositions*, the Form line is just `preposition + having + past participle`, the "when to use it" sentence no longer mentions *for / except / instead of*, and example 4 is deleted. The summary table row and quiz Q7 were checked — both were already gerund-only, so nothing else referenced it.

**Also done (extra request):** every example list on this page now has three items, not four. The two that had four lost *"They might have missed the train"* (modal perfects — *should / must / could* still cover obligation, probability and unrealised possibility, and the native-speaker note underneath depends on *should have called* and *could have helped*, so both were kept) and *"Be + adjective: I'm pleased to have met you"* (a be-adjective structure rather than a verb, and already covered by *"I'm happy to have finished the project on time"* higher up). The section intro was reworded to *"verbs of claiming, reporting, appearance and pretence"* to match.

### 9. ~~The page contradicts itself on `needn't have` vs `didn't need to`~~ — DONE

`grammar/advanced/advanced-modal-meanings.html` line 228.

The rule on the page says *"didn't need to do"* = the action **was not** done. But line 228 glosses *"You didn't need to pay for everyone"* as *"(factual - action happened but wasn't necessary)"* — the opposite.

**Fix:** make the gloss match the rule, or add a sentence acknowledging that *didn't need to* is genuinely ambiguous in real use.

**Done — rewritten on your instruction that the two mean the same thing and differ only in formality.** Changes across the lesson:

- The reproach list now reads *"Needn't have / didn't have to: … The two mean the same thing; needn't have is formal, didn't have to is what people normally say."*
- The everyday example *"I needn't have bought so much food"* was replaced with the formal *"You needn't have gone to so much effort"*; its partner now uses *didn't have to* rather than *didn't need to*.
- The comparison block was rewritten around formality, with *didn't have to* and *shouldn't have* both listed as the common alternatives, and a native-speaker note that *needn't have* survives mainly in set replies like *"You needn't have bothered."*
- The summary table row now reads `needn't have (= didn't have to)` and names *didn't have to* as the everyday form.
- **Common Error 4** taught the meaning distinction, so it had to go. It is replaced with a real error — *"I needn't to have bought the tickets"* → *"I needn't have bought the tickets"* — with a note that *didn't have to* means the same and sounds more natural.
- **Quiz Q3** was unanswerable under the corrected rule (options A *needn't have bought* and B *didn't need to buy* would both have been right). It is now a formality question: *"A colleague has brought you a gift you were not expecting. Which reply is the most formal?"* with *You needn't have brought me anything* as the answer. The keyed index stays `0`, and both explanation strings were rewritten. The page's inline JavaScript was syntax-checked after the edit and parses cleanly.

### 10. ~~"It might be going to rain soon."~~ — DONE

`grammar/advanced/modal-progressive.html`, deduction section.

Stacked modal + *be going to* is very marginal English and not something to model for learners.

**Fix:** *"It might rain soon"* or *"It looks like it's going to rain."*

**Done.** Replaced with a travel example that is a genuine present deduction: *"Their flight landed an hour ago. They **might be waiting** for their luggage. (It's possible)"*

**Answer to your question:** *might be going to* does not appear anywhere else in this lesson, or anywhere else on the site. The only other `be going` hits in the file are option B of Q10 and its answer comment, *"She could be going to the cinema tonight"* — that is modal + `be` + `going` with a destination, a real modal progressive, so it is correct and was left alone.

### 11. ~~Duplicate option letter in an advanced MCQ~~ — DONE

`grammar/advanced/passive-verbals.html` line 332, Q1.

Options run **A, B, A, D** — the third option is labelled `A. She enjoys being photographed.` instead of `C.`

**Done.** Relabelled `C.` It sits at `data-index="2"`, so the letter now matches its position; the answer key was not affected.

### 12. ~~Stray capital: "can also be Inverted"~~ — DONE

`grammar/advanced/inverted-conditionals.html` line 186. Should be lower case.

**Done.** Now *can also be inverted:*

### 13. ~~Duplicated tip number~~ — DONE

`grammar/advanced/advanced-present-perfect.html` lines 353 and 357 — two tips both labelled **TIP 3**. The second should be TIP 4.

**Done.** The stative-verbs tip is now TIP 4.

### 14. ~~Lower-case `spanish` and `i` on drag-and-drop tiles~~ — DONE

- `grammar/advanced/adverb-position.html` lines 292 (`spanish`) and 319 (`i`)
- `grammar/advanced/comment-adverbs.html` lines 270, 316 (`i`)
- `grammar/advanced/extra-practice/gerund-infinitive-practice.html` lines 353, 395 (`i`)

Learners assemble *"he speaks spanish fluently"* and *"yesterday, i finished the report"*. Every other page on the site uses a capital `I` tile (`compound-nouns`, `subjunctive1`, `articles`, `do-does-questions` and others), so these three files are the odd ones out.

**Fix:** capitalise the visible tile text. The answer strings are compared in lower case, so only the display needs changing.

**Done.** All six tiles in the three files listed now read `Spanish` / `I`. Verified before editing: `js/drag-drop.js` lower-cases both the dropped words and the answer before comparing (lines 445–462), so scoring is unaffected.

**Side effect to know about:** the same script restores saved in-progress answers by matching tile text exactly (line 716). A learner who had already dropped the old `i` or `spanish` tile on one of these questions and left the page mid-activity could see a duplicate tile when they come back. It clears on *Try Again* and affects no one who starts fresh.

**Missed in the original check:** `grammar/intermediate/verb-to-get.html` lines 293 and 318 have the same lower-case `i` tile. Not in this point's list, so not changed.

### 15. ~~"quizes"~~ — DONE

`about.html` line 183. Should be **quizzes**.

**Done.** Only the spelling was changed; the rest of that sentence is point 23.

---

## B. British English consistency

The site standard is British English (`CLAUDE.md`), and most pages follow it. These do not.

### 16. ~~`practice` used as a verb (should be `practise`)~~ — DONE

The noun is *practice*, the verb is *practise*. Verb uses found:

- `about.html` line 183 — *"activities are used to help practice new language"*
- `grammar/advanced/advanced-grammar.html` line 139 — *"to practice what you have learned"*
- All five extra-practice pages — *"Now it's time to practice what you've learned"* (`conditional-expressions-practice` 111, `conditionals-practice` 111, `inverted-conditionals-practice` 113, `wish-if-only-practice` 113)
- `grammar/beginner/restaurant_lesson1.html` lines 135, 236, 240
- `grammar/beginner/random-questions-beginners.html` lines 6, 333, 372
- `grammar/beginner/jobs_practice_activities.html` line 155
- Tips on `conditional-types.html` 388, `future-perfect-continuous.html` 309, `mixed-modals.html` 259, `mixed-time-frames.html` 316, `narrative-tenses.html` 280, `past-perfect-progressive.html` 297 and 305, `relative-clauses.html` 386
- `js/homepage-quiz.js` — *"The more you practice, the better you'll become"*

**Done.** Every verb use above is now *practise* / *practising*, plus two more that turned up in the full sweep: *"and practice all its forms"* on `mixed-modals.html`, and the page descriptions on `jobs_practice_activities.html` and `like-dont-like-practice.html`. The noun stays *practice* — page titles like *Conditional Types Practice*, *examples and practice*, and *"from practice"* (a doctor's practice) on `subjunctive2.html`. File names and folder names containing `practice` were not touched.

### 17. ~~The heading "How to Remember and Practice" (11 pages)~~ — DONE

`past-perfect-progressive.html` 290, and beginner `articles` 351, `countable-uncountable` 359, `past-simple` 396, `possessives` 324, `prepositions-time-place` 355, `present-continuous` 402, `present-simple` 364, `singular-plural-nouns` 386, `subject-pronouns-be` 435, `there-is-are` 370.

→ **How to Remember and Practise**. Listed separately from 16 because it is one find-and-replace across a repeated heading.

**Done.** All 11 headings changed.

### 18. ~~`-ize` / `-ise` is inconsistent site-wide~~ — DONE

Counts across the site: `emphasise` 87 vs `emphasize` 43; `recognise` 10 vs `recognize` 7. Both are defensible in British English, but mixing them on one site is not.

`-ize` spellings appear in: `advanced-grammar` 102, `advanced-modal-meanings` 9, `advanced-present-perfect` (14 occurrences), `conditional-expressions` (11), `future-perfect-continuous` 12/19/40, `inverted-conditionals` 7/8, `mixed-modals` 64, `mixed-time-frames` 41/45, `modal-differences` 67/72, `modal-perfect` 19/26/49, `narrative-tenses` 8/36/65, `passive-verbals` 75/100/125, `past-perfect-progressive` (6), plus `Nominalization` on `advanced-grammar` 71 and `generic-specific-reference` 192, and `apologize`, `realized`, `criticized`, `organize`, `visualize`, `unrealized` in individual items.

**Recommendation:** standardise on `-ise` (already the majority) and fix the outliers.

**Done.** 98 `-ize` forms changed to `-ise` across 18 files, including the homepage level test (*apologise*). *Nominalization* is now *Nominalisation* in the course index title, its checkbox label and the *Next* link on `generic-specific-reference.html`.

**Deliberately not changed:** the lower-case `nominalization` in the checkbox `id` and in `href="nominalization.html"` — the id is a progress key, which fails silently if renamed, and the href must match the file name when that lesson is built. A code comment and a debug script (`organized`, `minimize`) were also left alone.

### 19. ~~American spellings~~ — DONE

- `about.html` 248 — `student-centered` → **student-centred**
- `grammar/advanced/passive-reporting.html` 161 — `rumors` → **rumours**
- `grammar/beginner/random-questions-beginners.html` 24, 25 — `favorite` twice → **favourite**. Note `beginner-landing.html` already says *favourite* in the same example text, so the two copies disagree.
- `grammar/advanced/extra-practice/wish-if-only-practice.html` 52–55, 103 and `wish-if-only-would-rather.html` 114, 121–122 — `traveled`, `traveling`, `city center`
- `grammar/advanced/extra-practice/conditional-expressions-practice.html` 54 — `practicing`
- `grammar/advanced/extra-practice/conditionals-practice.html` 59 — `gotten`

**Done.** All of the above, plus what the full sweep found beyond this list:

- `favorite` appears **seven** times on `random-questions-beginners.html`, not two — the example answer and five of the random questions. All now *favourite*.
- The same page: *"apartments when traveling?"* → *travelling* (apartments kept, per your note).
- `city center` appears four times on `wish-if-only-practice.html` (question, model answer, two alternative answers) — all *city centre*.
- `gotten` → *got*: *"you would have got green"*.
- `license.html`: the generic noun is now *licence* — the headings *Content Licence*, *What This Licence Means*, *Website Code Licence*, and *"not covered by the licence above"*. The names of the actual licences stay as they are (*Creative Commons Attribution-NonCommercial 4.0 International License*, *SIL Open Font License*), and so does the verb *licensed*, which is the British spelling. The file name `license.html` was not changed.

Two typed-answer gaps already accepted both spellings (`travelling,traveling` on `gerund-infinitive.html`, `travelled,traveled` on `past-tense-review.html`), so they were left as they are.

### 20. ~~American vocabulary~~ — DONE (with exceptions)

- **`airplane`** throughout the travel course — `travel-english.html` (Unit 1 title, Lesson 2 title), `airport-lesson1.html`, `airport-lesson2.html` (title, headings, body), `airport-lesson2-cheatsheet.html`, `airport-lesson3.html`, `unit1-review.html`. British English is **plane** or **aeroplane**.
- **`transportation`** — `travel-english.html` lines 4, 36, 37, 39 → **transport**
- **`movie` / `movies`** — `future-perfect-continuous` 95, `mixed-time-frames` 71–72, `modal-perfect` 24, `narrative-tenses` 109, `nominal-clauses-review` 33, `present-perfect-progressive` 49, `relative-clauses` 23, plus the homepage quiz → **film**
- **`apartment`** — `future-perfect-continuous` 90, `mixed-time-frames` 114, `passive-get-have` 99 → **flat**
- **`zipper`** — `airport-lesson5.html` → **zip**
- **`store`, `grades in school`** — `grammar/intermediate/verb-to-get.html` lines 14–15, 21–23 → **shop**, **marks at school**
- **`bathrooms`** — `airport-lesson2.html`, `unit1-review.html` → **toilets**. A judgement call for travel English; flagging, not insisting.

**Your decisions — no change:** *movie* and *film* are both used in British English; *apartment* is used in British English; *bathroom* is kept because *toilet* is considered rude in American English, so *bathroom* is the safer word to teach.

**Done:**

- **airplane → plane.** Titles, headings, breadcrumbs, *Next/Previous* links, the cheat sheet, the review page and the unit overview. *"on an airplane"* became *"on a plane"* (article changed too). The unit title *Airport and Airplane Communication* became **At the Airport and on the Plane**, because *Airport and Plane Communication* doesn't read naturally; the review page title and subtitle follow the same wording.
- **Not changed:** the activity ids `gap-fill-airplane` / `drag-drop-airplane` and the saved-progress key `travel-lesson2-airplane`. Renaming them would wipe learners' saved progress on that lesson. They are never shown on screen.
- **transportation → transport** in all four places on `travel-english.html`.
- **zipper → zip** on `airport-lesson5.html`: the vocabulary tile and its drop zone together (they must match for the activity to mark), the image alt text, the flashcard, the speaking practice, the role-play card and the sentence-order activity (words and answer). The image file is still called `zipper.png` — the file name isn't shown.
- **store → shop, grades in school → marks at school** on `verb-to-get.html`, including the explanation sentence *"shopping, shops, or spending money"*.
- Found in the sweep: **vacation → holiday** (*"What is your dream holiday?"*) on `random-questions-beginners.html`.

**Also done, on your instruction:**

- **cookies → biscuits** in the `airport-lesson2.html` conversation: *"Would you like biscuits or nuts?" — "Biscuits, please."*
- **fill out → fill in** everywhere it appeared: three places in `airport-lesson4.html` (two staff lines and a role-play card) and every use in `airport-lesson5.html` — the vocabulary tile and its drop zone together, the image alt text, the flashcard, the speaking cards, the three role-play cells, the conversation script, a gap-fill distractor, and the sentence-order activity (words and answer). The unit overview was updated too. The image file is still called `fill-out.png`; the file name is never shown.
- **USA note added** where *fill in* first appears as vocabulary, in Lesson 5, straight after the vocabulary activity: *"Tip: In the UK, we say "fill in" a form. In the USA, people say "fill out" a form. They mean the same thing."* It uses the same lightbulb note box as the other tips on that page, placed outside the activity's container so it can't interfere with the drag-and-drop. (*Fill in* is used earlier, in Lesson 4's conversations, but Lesson 5 is where it is taught as a vocabulary word.)

### 21. ~~"on weekends" (American) vs "at the weekend"~~ — DONE

`beginner-landing.html` 30, `booking-page.html` 37, `like-dont-like-practice.html` 31, `random-questions-beginners.html` 25, `conditional-expressions-practice.html` 75, and — most importantly — `grammar/beginner/prepositions-time-place.html` lines 23 and 112, where it is taught as the rule: *"weekends (on weekends)"*.

British English is *at the weekend*. Since one of these is a preposition lesson, it is worth deciding deliberately rather than leaving both forms on the site.

**Correction to the above, per your note:** *on weekends* is correct British English, and so is *at the weekend*. *On the weekend* is the one that is not. The prose uses of *on weekends* listed above were left unchanged.

**Done:**

- `prepositions-time-place.html` now teaches both. The *Special cases* note adds: *"For weekends, you can say 'on weekends' or 'at the weekend'. 'On weekends' means every weekend. 'At the weekend' can mean every weekend or one weekend: 'What are you doing at the weekend?'"* The summary table keeps *weekends (on weekends)* in the **on** row and adds *the weekend (at the weekend)* to the **at** row, so the two forms sit side by side.
- `random-questions-beginners.html`: *"What do you do on the weekends?"* → *"What do you do at the weekend?"*

### 22. ~~American comma-inside-quotes punctuation~~ — DONE (site-wide)

`grammar/intermediate/verb-to-get.html` line 8 — *"receive," "become," and "arrive."* Most of the site puts the comma outside. Minor, but inconsistent.

**Done.** The phrase appeared twice on that page (the objectives and TIP 2); both now read *"receive", "become" and "arrive"*.

**Site-wide sweep done.** British rule applied: a comma or full stop goes inside the closing quote only when it belongs to the quoted words.

- **Changed — 201 places across 22 pages.** Wherever the quote marks surround a single word, a phrase or a grammar formula, the punctuation was moved outside: *"just", "already" and "yet"*, *"get home", "get here"*, *"modal + have + past participle".*, and the same inside quiz feedback (*'becoming'.*, *'Home', 'here'*). Heaviest pages: `verb-to-get.html` (49), `modal-differences.html` and `modal-perfect.html` (18 each), `perfect-infinitives-gerunds.html` (16), `present-perfect-progressive.html` (13), `advanced-present-perfect.html` (12).
- **Left as they are — correct in British English:** quoted whole sentences (*When someone says "I've lost my keys," they're…*), spoken replies (*"Yes, three times."*, *"Of course."*), text ending in an ellipsis (*"I'd like…"*), and gap-fill prompts (*"_____ some lemon juice."*).
- **Also left:** *"I want."* on `hotel-lesson1.html`, since you asked for point 31 not to be changed.

Every change was checked against the exact text before it was made, and the JavaScript on all 22 pages still parses. Quotes wrapping formatting tags (*"<em>word</em>,"*) were checked separately; there are none.
---

## C. Wording and clarity

### 23. ~~`about.html` line 183 — one sentence doing too much~~ — DONE

> "Lesson time is spent maximising conversation practice and interactive activities are used to help practice new language. Homework includes quizes, reading activities and writing tasks which are suitable for self study."

Three problems besides the `quizes` typo and the `practice`/`practise` slip: the first sentence joins two independent clauses with no comma before *and*; `self study` should be **self-study**; and `which` should be **that** in a defining clause.

**Suggested:** *"Lesson time is spent maximising conversation practice, and interactive activities help students practise new language. Homework includes quizzes, reading activities and writing tasks suitable for self-study."*

**Done.** Replaced with the suggested wording.

### 24. ~~`about.html` — "Private one-on-one Classes"~~ — DONE

Inconsistent capitalisation; should be *Private One-to-One Classes* or *Private one-to-one classes*. The site uses *one-to-one* on `booking-page.html` and *one-on-one* here and on `home.html` — pick one.

**Done.** Standardised on *one-to-one*, the British form. The heading is now *Private One-to-One Classes*, in title case like the other headings on `about.html`. Also changed: *"In addition to one-to-one classes"* further down `about.html`, *"personalised one-to-one coaching"* on `home.html`, and the social-sharing description on `booking-page.html`. *One-on-one* no longer appears anywhere on the site.

### 25. ~~Articles lesson glosses contradict the articles lesson~~ — DONE

`grammar/beginner/articles.html` lines 130, 138:

> She is **a** nurse. (= her job is nurse.)
> He is **an** engineer. (= his job is engineer.)

The explanation drops the very article the example is teaching — and the same page's Common Errors section says *"He is doctor" → "He is a doctor."*

**Fix:** *"(= she works as a nurse.)"* / *"(= he works as an engineer.)"*

**Done, differently from the suggestion.** On your instruction, *She is a nurse.* now has no bracketed explanation at all. For *He is an engineer.*, only the faulty half was removed: it now reads *(= "Engineer" starts with an "e" sound.)*, which is the part that teaches *an*, and matches *It is an old building. (= "Old" starts with an "o" sound.)* in the same list.

Added to `todo.md`, section 2: check whether the `(= …)` explanations in the beginner lessons are useful.

### 26. ~~`grammar/advanced/compound-nouns2.html` — repeated phrase~~ — DONE

> "…stress alone isn't always enough to tell the difference and native speakers rely on context as well as stress to tell the difference between a compound noun and a noun phrase…"

*"to tell the difference"* appears twice in one sentence, and there is no comma before *and*.

**Suggested:** *"…stress alone isn't always enough, and native speakers rely on context as well as stress to tell a compound noun from an adjective + noun phrase."*

**Done, with a smaller edit than suggested.** Only the duplicate phrase was cut and the comma added: *"stress alone isn't always enough, and native speakers rely on context as well as stress to tell the difference between a compound noun and a noun phrase with an adjective."* That keeps the page's own term, *noun phrase with an adjective*.

### 27. "'They' does the action" / "'We' does the action" — NO CHANGE

`grammar/beginner/possessives.html` lines 167, 168. Defensible as talk-about-the-word, but confusing on a beginner page.

**Suggested:** *"'They' is the one doing the action."*

**No change — your decision.** Fine as it is.

### 28. ~~Unclear MCQ option wording~~ — DONE

`grammar/advanced/nominal-clauses.html` Q2 offers **"D. both A and no word"**, while Q7 and Q9 on the same page say **"D. A or no word"**. Same idea, two phrasings; the first does not parse.

**Done.** Q2's option D now reads *A or no word*, matching Q7 and Q9. The answer key was unchanged (still D).

### 29. ~~An MCQ where none of the options is wrong~~ — DONE

`grammar/advanced/passive-get-have.html` Q8 — *"Which sentence contains an error?"* All four options are grammatical. The intended answer is presumably C (*"We had painted our house last summer"*), which is a perfectly good past perfect — just not a causative.

**Fix:** reword the stem to *"Which sentence is not a causative structure?"*, or change option C to an actual error.

**Done.** The stem now reads *"Which sentence is NOT a passive or causative structure?"* I widened my suggestion: B (*got fired*) and D (*was delivered*) are passives rather than causatives, so *"not a causative"* alone would have made three options correct. With *passive or causative*, only C qualifies. The answer key is unchanged (C). The correct-answer explanation was updated to match, and the wrong-answer message — which said *"This sentence is correctly formed"*, true of every option — now says: *"Not quite. This sentence uses a passive or causative structure. Look for the one where the subject did the action itself."*

### 30. Informal alternative that isn't English — RE-EVALUATED, NO CHANGE NEEDED

`grammar/advanced/subjunctive-revision.html` line 43 gives the casual alternative as *"I suggest he's more careful"*. That doesn't work as a suggestion.

**Fix:** *"I suggest he is more careful"* — better, *"I think he should be more careful."*

**Re-evaluated at your request.** You were right that the first suggestion was the same sentence without the contraction. Looking again, the original point was wrong: *"I suggest he's more careful"* is grammatical English, and it is the ordinary non-subjunctive form the note is illustrating. It follows exactly the same pattern your own `subjunctive2.html` teaches in TIP 3 (*"I suggest he leaves"*). The heading *"isn't English"* overstated it. No change is needed.

One small, optional observation: with *be* + an adjective, *"I suggest he's more careful"* can also be read as *"I'm hinting that he is more careful"*, which an action verb like *leaves* avoids. That is a reason you might prefer an action-verb example one day, not an error.

### 31. `hotel-lesson1.html` — "it's rude to say 'I want'" — NO CHANGE

Overstated. *I want* is direct rather than rude, and a beginner who reads this will avoid a perfectly normal verb.

**Suggested:** *"In English, 'I want' can sound very direct. 'I'd like…' sounds more polite."*

**No change — your decision.** In British English *"I want"* is considered rude when asking for things; children are taught they won't get what they want by saying it. *"Can I have…, please?"* is easy to learn and is what you teach, so the note stays as written.

---

## D. Not grammar, but found while reading

### 32. ~~Broken link~~ — DONE

`grammar/advanced/double-passive.html` line 221 links to `causatives.html`, which does not exist. The file is `causative-verbs.html`.

Also, both cross-reference links on this page (lines 152 and 221) show the raw filename as the link text — *"see passive-reporting.html"*. Better: *"see the lesson on Passive Reporting Verbs."*

**Done.** The link now points at `causative-verbs.html`. Both notes now read *"…see the lesson on Passive Reporting Verbs."* and *"…see the lesson on Causative Verbs."*, with the lesson name as the link text. Both target files were checked and exist.

### 33. ~~Wrong page title~~ — DONE

`grammar/advanced/passive-voice-summary.html` line 8:

`<title>Advanced Passive Constructions with Get and Have - Advanced ESL Grammar</title>`

The page is *Passive Voice: Complete Summary*. The tab and search results show the wrong lesson.

**Done.** Now *Passive Voice: Complete Summary - Advanced ESL Grammar*. `todo.md` already listed this page; its entry now notes the title is fixed. The page still needs prev/next buttons and a place on the course index, which stay open there.

### 34. ~~Wrong breadcrumb~~ — DONE

`grammar/advanced/wish-if-only-would-rather.html` line 104 — breadcrumb reads **Present Perfect Progressive**. Should be *Conditionals*, which is where `advanced-grammar.html` files it.

**Done.** Two parts of the breadcrumb were wrong, not one: the category said *Advanced Tenses* (linking to the tenses section) and the current page said *Present Perfect Progressive*. It now reads *… › Conditionals › Wish, If Only, and Would Rather*, with *Conditionals* linking to `advanced-grammar.html#conditionals` — the same pattern as `conditional-expressions.html` and `inverted-conditionals.html`.

### 35. ~~Mislabelled table column~~ — DONE

`grammar/advanced/passive-voice.html` line 207 — the summary table's first column is headed **Active Voice**, but it contains tense names (*Present Simple*, *Past Simple*…). It should be **Tense**.

**Done.**

### 36. ~~Score denominator doesn't match the number of gaps~~ — DONE

`grammar/beginner/jobs_practice_activities.html` — the gap-fill has **16** gaps but line 260 displays **/15**. Same class of bug as the 7/5 one fixed before.

**Done.** Now */16*. Checked first that this was visible to learners: `gap-fill.js` only updates the first number, so the */15* really was on screen, and a perfect score showed as *16/15*. The progress tracker already used the real count (16).

### 37. Activity with no score display — NOT A BUG, NO CHANGE

`travel/beginner-travel/Unit1/unit1-review.html` — the *Grammar Gaps* activity has 10 dropdowns but no `score-display` element, while the other four activities on the page all have one.

**Correction: this point was wrong.** Dropdown activities don't use a *Your score: N/N* box by design. `drop-down.js` reports the result as a sentence — *"7/10 correct. Review the highlighted answers and try again."* — in an element named `<activity id>Feedback`. The review page has `reviewGapsFeedback`, exactly like every other page with a dropdown activity (`compound-nouns2.html`, `dependent-prepositions2.html`, `generic-specific-reference.html`, Lessons 3 and 5). Learners already see their score. Adding a score box would make this the only dropdown activity with one, so nothing was changed.

### 38. ~~Stray text after a dropdown~~ — DONE (please check)

`grammar/advanced/compound-nouns2.html` line 261 — sentence 3 reads *"A train ticket price increase is [answer] **this year.**"* The trailing *this year* leaves the sentence ungrammatical once the answer is chosen. Same pattern as commit 628e417.

**Correction to the history above.** Commit 628e417 did not remove *this year* from somewhere else: it is where *this year.* came from, replacing an earlier instruction tail (*— read it backwards to check.*). So it was a recent, deliberate edit, not a leftover.

**Done anyway, as a one-line change that's easy to undo.** With the answer chosen, the sentence read *"A train ticket price increase is an increase in the price of train tickets this year."* — a definition with a time phrase attached. It now ends with a full stop straight after the dropdown: *"A train ticket price increase is [an increase in the price of train tickets]."* The full stop sits directly against the `</select>` tag so no space appears before it. If you wanted *this year.* there for a reason, it is a single line to put back.

### 39. ~~Quiz says "9 questions each" but the parts are uneven~~ — DONE

`grammar-quiz-1.html` lines 638 and 647 (English and Portuguese) say *"5 parts with 9 questions each"*. The actual parts are **10, 9, 9, 9, 8** = 45.

**Fix:** *"5 parts, 45 questions in total."*

**Done.** English: *"It has 5 parts and 45 questions in total."* Portuguese: *"Tem 5 partes e 45 perguntas no total."*

### 40. ~~Travel course index is out of date~~ — DONE (one decision open)

`travel/beginner-travel/travel-english.html` lists Unit 1 as four lessons plus the review, but `airport-lesson5.html` (*Reporting Luggage Problems*) exists and is linked from the review. The *"41 Lessons"* count on line 5 also does not include it. Lessons 4 and 5 overlap heavily — both cover lost and damaged luggage.

**Correction:** Lesson 5 was not linked from Lesson 4, as originally written above. Lesson 4's *Next* button went straight to the Unit 1 Review, so nothing on the site sent a learner forward into Lesson 5. It was only reachable backwards, from the review's *Previous* button.

**Done:**

- Added *Lesson 5: Reporting Luggage Problems* to the Unit 1 list on `travel-english.html`, with a completion checkbox (`airport-5`, following the existing `airport-1`…`airport-4` pattern; those ids aren't used anywhere else).
- Lesson 4's *Next* button now goes to Lesson 5. The chain is now Lesson 4 → Lesson 5 → Unit 1 Review, and Lesson 5's own *Previous* and *Next* buttons already pointed that way.
- *41 Lessons* → **42 Lessons**. The old 41 was 40 lessons plus the review; the list now has 41 lessons plus the review, so 42 keeps the same way of counting.

**Still your decision:** the overlap between Lessons 4 and 5. Both cover reporting lost and damaged luggage, with similar phrases (*My bag didn't arrive*, *The handle is broken*, claim forms). Merging them, or refocusing one, is a content choice. `unit-1-overview.md` also has no section for Lesson 5 yet; I haven't written one, since what Lesson 5 covers may change.

---

## Summary

| Section | Points | What it is |
|---|---|---|
| A | 1–15 | Wrong English visible to learners. Fix first — 2, 3 and 6 mis-teach. |
| B | 16–22 | British English consistency. Mostly find-and-replace. |
| C | 23–31 | Wording, clarity, self-contradictions. |
| D | 32–40 | Links, titles, labels, score counts. |

The highest-value fixes are **2** and **3** (the level test marks wrong English as correct), **1**, **4** and **5** (beginner pages teaching the opposite of their own rule), and **16–17** (`practise`, one replace across 30-odd files).
