/* A student folder's authored lesson links define its dashboard scope. */
document.addEventListener('DOMContentLoaded', function () {
  const progress = window.WebsiteProgress;
  const root = window.WebsiteLesson.root;
  const list = document.getElementById('student-lesson-list');
  const entries = [...list.querySelectorAll('[data-lesson-status]')].map(status => {
    const link = status.closest('li').querySelector('a');
    const path = decodeURIComponent(new URL(link.href).pathname).slice(root.pathname.length);
    return { status, lesson: window.WebsiteLessonCatalog.find(lesson => lesson.path === path) };
  }).filter(entry => entry.lesson);
  const text = (id, value) => { document.getElementById(id).textContent = value; };

  function render() {
    const summary = progress.summary();
    const signedIn = Boolean(summary.uid);
    const ready = signedIn && !['loading', 'error'].includes(summary.status);
    const name = window.WebsiteStudent?.firstName;
    text('student-lessons-greeting', signedIn && name ? `${name}'s lessons` : 'My Lessons');
    const notice = document.querySelector('.website-save-notice');
    window.WebsiteLesson.updateNotice(notice, document.getElementById('save-status'));
    document.getElementById('retry-sync').hidden = summary.status !== 'error';
    document.getElementById('progress-content').hidden = !ready;
    document.getElementById('no-progress-message').hidden = signedIn || summary.status === 'loading';

    const lessons = entries.map(({ status, lesson }) => {
      const state = summary.lessons.find(item => item.path === lesson.path);
      status.textContent = !signedIn ? 'Log in to save your progress.' : !ready ?
        'Waiting for your saved progress...' : state?.complete ? 'Completed' :
        state?.started ? `${state.done} of ${lesson.activities.length} activities completed` : 'Not started';
      return { ...lesson, done: state?.done || 0, complete: Boolean(state?.complete), started: Boolean(state?.started) };
    });
    const continuation = document.getElementById('continue-learning');
    continuation.replaceChildren();
    if (!ready) return;
    const completed = lessons.filter(lesson => lesson.complete).length;
    text('course-percentage', `${lessons.length ? Math.round(completed / lessons.length * 100) : 0}%`);
    text('course-lessons', `${completed}/${lessons.length}`);
    text('course-activities', lessons.reduce((total, lesson) => total + lesson.done, 0));
    text('course-activities-total', `out of ${lessons.reduce((total, lesson) => total + lesson.activities.length, 0)}`);
    text('week-days', summary.week);
    text('month-days', summary.month);
    const next = lessons.find(lesson => lesson.path === summary.last?.path && !lesson.complete) ||
      lessons.find(lesson => !lesson.complete) || lessons[lessons.length - 1];
    if (!next) return;
    const heading = document.createElement('h2');
    heading.textContent = completed === lessons.length ? 'Ready to revise?' : 'Your next lesson';
    const description = document.createElement('p');
    description.textContent = next.title;
    const link = document.createElement('a');
    link.className = 'nav-button';
    link.href = new URL(next.path, root).href;
    link.textContent = completed === lessons.length ? 'Revise this lesson' : next.started ? 'Continue lesson' : 'Start lesson';
    continuation.append(heading, description, link);
  }

  progress.subscribe(render);
  document.addEventListener('websiteAccountChanged', render);
  document.getElementById('retry-sync').addEventListener('click', () => progress.flush());
  render();
});
