/**
 * My Progress page — page-specific logic.
 * Depends on ProgressTracker and ProgressManagerUI, both initialised by init-progress.js.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Update stat cards whenever progress changes
  if (typeof ProgressTracker !== 'undefined') {
    ProgressTracker.addProgressChangeCallback(updateStatCards);
  }

  // Build the dynamic UI sections
  if (typeof ProgressManagerUI !== 'undefined') {
    ProgressManagerUI.createProgressSummary('category-progress');
    ProgressManagerUI.createAchievementDisplay('achievements', { showAll: true });
  }

  createRecentActivityDisplay();

  // Reset button
  const resetBtn = document.getElementById('reset-progress');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
        ProgressTracker.resetAllProgress(false);
        location.reload();
      }
    });
  }

  checkInitialProgress();
  updateStatCards();
});

function checkInitialProgress() {
  try {
    const progress = ProgressTracker.getOverallProgress();
    const hasProgress = progress.completed > 0 || ProgressTracker.getStats().dailyStreak > 0;
    document.getElementById('no-progress-message').style.display = hasProgress ? 'none' : 'block';
    document.getElementById('progress-content').style.display  = hasProgress ? 'block' : 'none';
  } catch (e) {
    console.error('Error checking initial progress:', e);
    document.getElementById('no-progress-message').style.display = 'block';
    document.getElementById('progress-content').style.display  = 'none';
  }
}

function updateStatCards() {
  try {
    const progress = ProgressTracker.getOverallProgress();
    const stats    = ProgressTracker.getStats();

    document.getElementById('overall-percentage').textContent = progress.percentage + '%';
    document.getElementById('overall-fraction').textContent   =
      progress.completed + '/' + progress.total + ' completed';

    document.getElementById('activities-count').textContent =
      progress.categories.activities ? progress.categories.activities.completed : 0;
    document.getElementById('total-activities').textContent =
      progress.categories.activities ? progress.categories.activities.total : 0;

    document.getElementById('lessons-count').textContent =
      progress.categories.lessons ? progress.categories.lessons.completed : 0;
    document.getElementById('total-lessons').textContent =
      progress.categories.lessons ? progress.categories.lessons.total : 0;

    document.getElementById('streak-count').textContent = stats.dailyStreak || 0;
  } catch (e) {
    console.error('Error updating stat cards:', e);
  }
}

function createRecentActivityDisplay() {
  try {
    const container = document.getElementById('recent-activity');
    if (!container) return;

    const activities = getRecentActivities(5);

    if (activities.length === 0) {
      container.innerHTML = '<p>No recent activity to display. Start learning to see your activity here!</p>';
      return;
    }

    const list = document.createElement('ul');
    list.className = 'activity-list';

    activities.forEach(function(activity) {
      const item = document.createElement('li');
      item.className = 'activity-item';

      let icon = '📝';
      if (activity.category === 'lessons')     icon = '📚';
      if (activity.category === 'assessments') icon = '📊';

      const iconEl = document.createElement('span');
      iconEl.className   = 'activity-icon';
      iconEl.textContent = icon;
      item.appendChild(iconEl);

      const details = document.createElement('div');
      details.className = 'activity-details';

      const title = document.createElement('span');
      title.className   = 'activity-title';
      title.textContent = activity.title;
      details.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'activity-meta';

      if (activity.score !== undefined && activity.maxScore !== undefined) {
        const score = document.createElement('span');
        score.className   = 'activity-score';
        score.textContent = 'Score: ' + activity.score + '/' + activity.maxScore;
        meta.appendChild(score);
      }

      const date = document.createElement('span');
      date.className   = 'activity-date';
      date.textContent = formatRelativeTime(activity.completedAt || activity.timestamp);
      meta.appendChild(date);

      details.appendChild(meta);
      item.appendChild(details);
      list.appendChild(item);
    });

    container.appendChild(list);
  } catch (e) {
    console.error('Error creating recent activity display:', e);
    document.getElementById('recent-activity').innerHTML = '<p>Error loading recent activity.</p>';
  }
}

function getRecentActivities(limit) {
  limit = limit || 5;
  try {
    const data = ProgressTracker.getProgressData();
    if (!data) return [];

    const activities = [];

    if (data.activities) {
      Object.entries(data.activities).forEach(function([id, d]) {
        if (d.completed) {
          activities.push({
            id: id, category: 'activities',
            title: d.title || formatId(id),
            score: d.score, maxScore: d.maxScore,
            completedAt: d.completedAt,
            timestamp: d.completedAt || new Date().toISOString()
          });
        }
      });
    }

    if (data.lessons) {
      Object.entries(data.lessons).forEach(function([id, d]) {
        if (d.lastViewed) {
          activities.push({
            id: id, category: 'lessons',
            title: d.title || formatId(id),
            timestamp: d.lastViewed || new Date().toISOString()
          });
        }
      });
    }

    if (data.assessments) {
      Object.entries(data.assessments).forEach(function([id, d]) {
        if (d.completed) {
          activities.push({
            id: id, category: 'assessments',
            title: d.title || formatId(id),
            score: d.score, maxScore: d.maxScore,
            completedAt: d.completedAt,
            timestamp: d.completedAt || new Date().toISOString()
          });
        }
      });
    }

    activities.sort(function(a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
    return activities.slice(0, limit);
  } catch (e) {
    console.error('Error getting recent activities:', e);
    return [];
  }
}

function formatId(id) {
  return id
    .replace(/^mcq-/, '')
    .replace(/^gap-fill-/, '')
    .replace(/^transformation-/, '')
    .replace(/-/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, function(l) { return l.toUpperCase(); });
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Unknown time';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid date';

  const diffSec = Math.floor((new Date() - date) / 1000);
  if (diffSec < 60) return 'Just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin + ' minute' + (diffMin !== 1 ? 's' : '') + ' ago';

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + ' hour' + (diffHr !== 1 ? 's' : '') + ' ago';

  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) {
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return diffDays + ' days ago';
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
