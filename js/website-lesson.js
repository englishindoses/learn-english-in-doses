/* Adapts the existing lesson controls to account progress without saving HTML.
 * Snapshots contain plain values and movable-item identities, never executable markup.
 */
(function () {
  'use strict';
  const progress = window.WebsiteProgress;
  if (!progress) return;
  const source = document.currentScript.src;
  const root = new URL('../', source);
  const path = decodeURIComponent(location.pathname).slice(root.pathname.length);
  const lesson = (window.WebsiteLessonCatalog || []).find(l => l.path === path);
  const states = new Map();
  let restoring = false, restored = false, saveTimer;
  const widgets = {
    mcq: '.question', drag: '.drop-zone', gap: '.gap-input', dropdown: '.gap-dropdown',
    wordgap: '.wgf-input', fix: '.fs-input', spelling: '.ss-input',
    choose: '.cc-choice-group', odd: '.ooo-group', listen: '.lc-question',
    compact: '.cm-answer-slot', matching: '.matching-question', vocab: '.vocab-drop-zone',
    flashcards: '.flashcard', speaking: '.sq-question',
    manual: '.website-practice-done',
  };
  const choice = '.option, .cc-choice, .ooo-option, .lc-option';
  const pieces = '.drag-item, .vocab-word-item, .cm-marker';
  const zones = '.drop-zone, .vocab-drop-zone, .cm-answer-slot';
  const all = (node, selector) => [...node.querySelectorAll(selector)];
  const identity = node => [node.dataset.match || '', node.dataset.answer || '', node.textContent.trim()];
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  function snapshot(state) {
    const { node, spec } = state;
    const questions = all(node, widgets[spec.type]);
    const answers = {
      fields: all(node, 'input:not([type="radio"]):not([type="hidden"]), select, textarea').map(n => ({ value: n.value, checked: n.checked })),
      choices: all(node, '.question, .cc-choice-group, .ooo-group, .lc-question').map(q => {
        const options = all(q, choice);
        return options.findIndex(n => n.classList.contains('selected') || n.querySelector('input:checked'));
      }),
      placements: all(node, zones).map(z => all(z, pieces).map(identity)),
      matched: all(node, '.matching-question').map(q => q.classList.contains('matched')),
      viewed: all(node, '.flashcard').map((card, i) => state.viewed.has(i) || card.classList.contains('flipped')),
      speaking: all(node, '.sq-check').map(n => n.classList.contains('checked')),
      manual: Boolean(node.querySelector('.website-practice-done')?.getAttribute('aria-pressed') === 'true'),
    };
    answers.viewed.forEach((yes, i) => { if (yes) state.viewed.add(i); });
    let answered = 0;
    if (spec.type === 'mcq' || ['choose', 'odd', 'listen'].includes(spec.type)) {
      answered = answers.choices.filter(i => i >= 0).length;
    } else if (['drag', 'compact', 'vocab'].includes(spec.type)) {
      answered = answers.placements.filter((items, i) => {
        if (!items.length) return false;
        // Sentence ordering needs every tile, not one word in each drop zone.
        if (spec.type === 'drag') {
          const question = questions[i]?.closest('.question');
          return !question || !question.querySelector('.drag-items .drag-item');
        }
        return true;
      }).length;
    } else if (spec.type === 'matching') answered = answers.matched.filter(Boolean).length;
    else if (spec.type === 'flashcards') answered = answers.viewed.filter(Boolean).length;
    else if (spec.type === 'speaking') answered = answers.speaking.filter(Boolean).length;
    else if (spec.type === 'manual') answered = answers.manual ? 1 : 0;
    else answered = questions.filter(q => q.value.trim() !== '').length;
    const automatic = ['matching', 'flashcards', 'speaking', 'manual'].includes(spec.type);
    const completed = answered === spec.total && (automatic || state.checked);
    const scoreNode = document.getElementById(spec.id + '-score') || node.querySelector('.vocab-score, .cm-score');
    const score = scoreNode ? Number(scoreNode.querySelector('span')?.textContent) : null;
    return { answers, answered, total: spec.total, checked: state.checked, completed,
      score: Number.isFinite(score) ? score : null };
  }

  function save(state) {
    if (restoring || !restored || !progress.signedIn) return;
    const value = snapshot(state);
    if (!same(value, state.previous)) {
      progress.record(path, state.spec.id, value, true, state.previous?.answers);
      state.previous = value;
    }
  }

  function restore(state, value) {
    if (!value?.answers) { state.previous = snapshot(state); return; }
    const { node, spec } = state, a = value.answers;
    all(node, 'input:not([type="radio"]):not([type="hidden"]), select, textarea').forEach((n, i) => {
      if (!a.fields?.[i]) return;
      n.value = a.fields[i].value; n.checked = Boolean(a.fields[i].checked);
      n.dispatchEvent(new Event('input', { bubbles: true }));
      n.dispatchEvent(new Event('change', { bubbles: true }));
    });
    all(node, '.question, .cc-choice-group, .ooo-group, .lc-question').forEach((q, i) => {
      if (a.choicesById?.[q.id] !== undefined) {
        all(q, choice).find(n => Number(n.dataset.index) === Number(a.choicesById[q.id]))?.click();
      } else if (a.choices?.[i] >= 0) all(q, choice)[a.choices[i]]?.click();
    });
    // Move the original nodes, retaining each module's drag/touch listeners.
    const available = all(node, pieces);
    all(node, zones).forEach((zone, i) => {
      for (const key of a.placements?.[i] || []) {
        const at = available.findIndex(n => same(identity(n), key));
        if (at < 0) continue;
        const piece = available.splice(at, 1)[0];
        zone.appendChild(piece);
        zone.classList.remove('empty');
        piece.classList.remove('in-bank');
      }
    });
    all(node, '.matching-question').forEach((question, i) => {
      if (!a.matched?.[i]) return;
      question.click();
      all(node, '.matching-answer').find(n => n.dataset.index === question.dataset.index)?.click();
    });
    all(node, '.flashcard').forEach((n, i) => { if (a.viewed?.[i]) { state.viewed.add(i); n.click(); } });
    all(node, '.sq-check').forEach((n, i) => { if (a.speaking?.[i]) n.click(); });
    if (a.manual) node.querySelector('.website-practice-done')?.click();
    state.checked = Boolean(value.checked);
    if (state.checked) {
      const check = checkButton(state);
      const scoreNode = document.getElementById(spec.id + '-score') || node.querySelector('.vocab-score, .cm-score');
      if (scoreNode) {
        const walker = document.createTreeWalker(scoreNode, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) walker.currentNode.textContent = walker.currentNode.textContent.replace(/\/\s*\d+/, '/' + spec.total);
      }
      // Partial submissions are restored as editable answers; do not reopen a blank-answer modal.
      if (value.answered === state.spec.total) check?.click();
    }
    state.previous = snapshot(state);
  }

  function checkButton(state) {
    return document.getElementById(state.spec.id + '-submit') ||
      document.getElementById(state.spec.id + '-cm-submit') ||
      (state.spec.type === 'mcq' ? document.getElementById('mcq-submit') : null) ||
      (state.spec.type === 'dropdown' ? document.getElementById('dropdown-check') : null) ||
      state.node.querySelector('.vocab-check-btn, .cm-submit-btn') ||
      [...document.querySelectorAll('button[onclick]')].find(n => n.getAttribute('onclick').includes(`checkDropdownAnswers('${state.spec.id}')`));
  }

  function fixDenominator(state) {
    const score = document.getElementById(state.spec.id + '-score') ||
      (state.spec.type === 'mcq' ? document.getElementById('mcq-score') : null) ||
      state.node.querySelector('.vocab-score, .cm-score');
    if (!score) return;
    const walker = document.createTreeWalker(score, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) walker.currentNode.textContent = walker.currentNode.textContent.replace(/\/\s*\d+/, '/' + state.spec.total);
  }

  function statusText() {
    const s = progress.summary();
    if (!s.uid) return s.status === 'loading' ? 'Checking your account…' : 'Log in to save your answers and progress.';
    if (s.storageBlocked) return 'Browser storage is unavailable. Keep this page open until your progress is saved online.';
    if (s.status === 'error') return 'Your progress has not synced. Check your connection and select Retry.';
    return ({ loading: 'Loading your saved progress…', pending: 'Changes waiting to save…', saving: 'Saving your progress…', saved: 'Your progress is saved.' })[s.status] || '';
  }

  const noticeStates = new WeakMap();
  function updateNotice(notice, text) {
    const message = statusText();
    let state = noticeStates.get(notice);
    if (!state) { state = {}; noticeStates.set(notice, state); }
    if (state.message === message) return;
    clearTimeout(state.timer);
    state.message = message;
    text.textContent = message;
    notice.hidden = !message;
    const summary = progress.summary();
    if (summary.status === 'saved' && !summary.storageBlocked) {
      state.timer = setTimeout(() => { notice.hidden = true; text.textContent = ''; }, 3000);
    }
  }

  function boot() {
    if (!lesson) return;
    const notice = document.createElement('div');
    notice.className = 'note website-save-notice';
    const text = document.createElement('span'); text.setAttribute('role', 'status');
    const retry = document.createElement('button'); retry.className = 'check-btn'; retry.textContent = 'Retry';
    retry.addEventListener('click', () => progress.flush());
    notice.append(text, ' ', retry);
    document.querySelector('main')?.prepend(notice);
    for (const spec of lesson.activities) {
      let node = document.getElementById(spec.id);
      if (spec.type === 'manual') {
        node ||= [...document.querySelectorAll('h2')].find(h => h.textContent.trim() === spec.label)?.closest('section');
        if (node) {
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'check-btn website-practice-done';
          button.setAttribute('aria-pressed', 'false'); button.textContent = 'Mark as practised';
          button.addEventListener('click', () => {
            const done = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', String(done));
            button.textContent = done ? 'Practised ✓' : 'Mark as practised';
          });
          node.append(button);
        }
      }
      if (!node) continue;
      const state = { spec, node, checked: false, viewed: new Set(), previous: null };
      states.set(spec.id, state);
      fixDenominator(state);
      const check = checkButton(state);
      // Attach after the existing module listeners. A cancelled blank-answer
      // confirmation never bubbles to this listener as a successful check.
      check?.addEventListener('click', () => {
        if (restoring) return;
        fixDenominator(state);
        if (snapshot(state).answered === spec.total) state.checked = true;
        save(state);
      });
      [...document.querySelectorAll('button[onclick]')].find(n => n.getAttribute('onclick').includes(`resetDropdownActivity('${spec.id}')`))?.addEventListener('click', () => {
        state.checked = false; save(state);
      });
      if (spec.type === 'dropdown') document.getElementById('dropdown-restart')?.addEventListener('click', () => {
        state.checked = false; save(state);
      });
      node.addEventListener('click', event => {
        if (event.target.closest('[id$="-restart"], .vocab-reset-btn, .cm-restart-btn, button[onclick^="resetDropdownActivity"]')) state.checked = false;
        setTimeout(() => save(state), 0);
      });
      node.addEventListener('input', () => { state.checked = false; save(state); });
      node.addEventListener('change', () => { state.checked = false; save(state); });
      // Touch/HTML drag-and-drop and staggered flashcard flips mutate the DOM.
      // Only capture answer changes, not feedback/style animation churn.
      new MutationObserver(() => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => { for (const item of states.values()) save(item); }, 80);
      }).observe(node, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    }
    const completion = document.createElement('div');
    completion.className = 'website-lesson-completion';
    const completeButton = document.createElement('button');
    completeButton.type = 'button'; completeButton.className = 'check-btn';
    const completeStatus = document.createElement('p'); completeStatus.setAttribute('role', 'status');
    completeButton.addEventListener('click', () => {
      for (const state of states.values()) save(state);
      progress.completeLesson(path);
    });
    completion.append(completeButton, completeStatus);
    document.querySelector('main')?.append(completion);
    const update = () => {
      const summary = progress.summary();
      updateNotice(notice, text); retry.hidden = summary.status !== 'error';
      const waiting = summary.status === 'loading';
      const complete = summary.lessons.find(l => l.path === path)?.complete;
      completeButton.textContent = complete ? 'Completed ?' : 'Mark as complete';
      completeButton.disabled = complete || !summary.uid || waiting;
      completeStatus.textContent = !summary.uid && !waiting ? 'Log in to save lesson completion.' : '';
      for (const state of states.values()) {
        state.node.inert = waiting;
        const check = checkButton(state); if (check) check.disabled = waiting;
      }
      if (!waiting && !restored) {
        restoring = true;
        for (const state of states.values()) restore(state, progress.getActivity(path, state.spec.id));
        restoring = false; restored = true;
        if (summary.last?.path === path && !summary.last.complete) {
          const unfinished = lesson.activities.find(a => !progress.getActivity(path, a.id)?.completed);
          const tab = unfinished && document.querySelector(`[data-activity="${CSS.escape(unfinished.id)}"]`);
          tab?.click();
        }
      }
    };
    progress.subscribe(update); update();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { for (const state of states.values()) save(state); progress.flush(); }
    });
    window.addEventListener('pagehide', () => { for (const state of states.values()) save(state); });
  }

  // Legacy activity modules must not load shared browser answers into an account.
  // Tour-guide pages do not load this script and retain their explicit opt-out.
  window.WebsiteLesson = { active: Boolean(lesson), statusText, updateNotice, root, snapshot };
  document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 0));
})();
