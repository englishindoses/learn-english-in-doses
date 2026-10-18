/* Personal dashboard content is derived only from the confirmed account. */
document.addEventListener('DOMContentLoaded', function () {
  const progress = window.WebsiteProgress;
  function render() {
    const summary = progress.summary();
    const name = window.WebsiteStudent?.firstName;
    document.getElementById('dashboard-greeting').textContent = summary.uid && name ? `Welcome, ${name}!` : 'My Dashboard';
    const container = document.getElementById('dashboard-lessons');
    container.replaceChildren();
    if (!summary.uid) return;
    const lessons = summary.lessons.filter(l => l.started);
    document.getElementById('dashboard-lessons-intro').textContent = lessons.length ?
      'Pick up a lesson you have started, or explore another course below.' :
      'Choose a course below to get started. Your lessons will appear here as you practise.';
    const list = document.createElement('ul'); list.className = 'activity-list';
    for (const lesson of lessons) {
      const item = document.createElement('li'); item.className = 'activity-item';
      const details = document.createElement('div'); details.className = 'activity-details';
      const link = document.createElement('a'); link.className = 'activity-title';
      link.textContent = lesson.title; link.href = new URL(lesson.path, window.WebsiteLesson.root).href;
      const status = document.createElement('p'); status.className = 'activity-meta';
      status.textContent = lesson.complete ? 'Completed' : `${lesson.done} of ${lesson.activities.length} activities done`;
      details.append(link, status); item.append(details); list.append(item);
    }
    container.append(list);
  }
  progress.subscribe(render);
  document.addEventListener('websiteAccountChanged', render);
  render();
});
