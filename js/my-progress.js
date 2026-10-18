/* Website dashboard: the same account records used by lesson pages. */
document.addEventListener('DOMContentLoaded', function () {
  const progress = window.WebsiteProgress;
  const root = window.WebsiteLesson.root;
  const text = (id, value) => { const n = document.getElementById(id); if (n) n.textContent = value; };
  const el = (tag, value, cls) => {
    const n = document.createElement(tag);
    if (value) n.textContent = value;
    if (cls) n.className = cls;
    return n;
  };
  function link(lesson, label) {
    const n = el('a', label || lesson.title, 'nav-button');
    n.href = new URL(lesson.path, root).href;
    return n;
  }
  function render() {
    const s = progress.summary();
    text('save-status', window.WebsiteLesson.statusText());
    document.getElementById('retry-sync').hidden = s.status !== 'error';
    document.getElementById('reset-progress').disabled = !s.uid || s.status === 'loading';
    document.getElementById('import-old-progress').hidden = !s.uid;
    document.getElementById('progress-content').hidden = !s.uid;
    document.getElementById('no-progress-message').style.display = !s.uid && s.status !== 'loading' ? 'block' : 'none';
    text('overall-percentage', s.percentage + '%');
    text('overall-fraction', `${s.completed}/${s.total} lessons completed`);
    text('activities-count', s.activities); text('total-activities', s.totalActivities);
    text('lessons-count', s.completed); text('total-lessons', s.total);
    text('week-days', s.week); text('month-days', s.month);
    const continuation = document.getElementById('continue-learning');
    continuation.replaceChildren(el('h2', 'Continue learning'));
    if (s.last) {
      continuation.append(el('p', s.last.complete ? `You finished ${s.last.title}.` :
        `${s.last.title}: ${s.last.done} of ${s.last.activities.length} activities done.`));
      if (s.next) continuation.append(link(s.next, s.last.complete ? `Next: ${s.next.title}` : 'Continue this lesson'));
      else continuation.append(el('p', 'You have reached the end of this course. Choose another lesson when you are ready.'));
    } else continuation.append(el('p', 'Start a lesson and your place will appear here.'));
    const categories = document.getElementById('category-progress'); categories.replaceChildren();
    for (const course of new Set(s.lessons.map(l => l.course))) {
      const lessons = s.lessons.filter(l => l.course === course);
      categories.append(el('p', `${course}: ${lessons.filter(l => l.complete).length}/${lessons.length} lessons completed`));
    }
    const recent = document.getElementById('recent-activity'); recent.replaceChildren();
    const data = progress.getData();
    const latest = l => Math.max(0, ...Object.values(data.lessons[l.path].activities).map(a => a.updatedAt || 0));
    const visited = s.lessons.filter(l => l.started).sort((a, b) => latest(b) - latest(a));
    if (!visited.length) recent.append(el('p', 'Your lessons will appear here as you practise.'));
    else for (const lesson of visited.slice(0, 10)) {
      const row = el('p'); row.append(link(lesson), ` — ${lesson.complete ? 'Completed' : `${lesson.done}/${lesson.activities.length} activities done`}`);
      recent.append(row);
    }
  }
  progress.subscribe(render); render();
  document.getElementById('retry-sync').addEventListener('click', () => progress.flush());
  document.getElementById('reset-progress').addEventListener('click', async () => {
    if (!confirm('Delete your saved website answers and progress? Your practice app is not affected.')) return;
    try { await progress.reset(); location.reload(); } catch (error) { alert(error.message); }
  });
  document.getElementById('import-old-progress').addEventListener('click', () => {
    if (!confirm('Add the old answers saved in this browser to your account? Only do this if they are your answers. The old copy will be kept.')) return;
    const count = progress.importLegacy();
    alert(count ? `Imported answers from ${count} activities. They will sync to your account.` : 'No compatible old answers were found. Your old browser data has been kept.');
  });
});
