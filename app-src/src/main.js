import './styles/site.css';
import './styles/app.css';

import { route, fallback, startRouter, go } from './lib/router.js';
import { setupPWA } from './lib/pwa.js';
import { settings } from './lib/storage.js';
import { homeScreen } from './screens/home.js';
import { topicsScreen } from './screens/topics.js';
import { activitiesScreen } from './screens/activities.js';
import { startSession, resumeSession } from './screens/session.js';
import { reviewScreen } from './screens/review.js';
import { questionsScreen } from './screens/questions.js';
import { progressScreen } from './screens/progress.js';
import { helpScreen } from './screens/help.js';

applySettings();
setupPWA();

route('/', homeScreen);
route('/topics', topicsScreen);
route('/topic/:id', activitiesScreen);
route('/practice/:id/:type', ({ id, type }) => startSession(id, type));
route('/practice/:id/:type/replay', ({ id, type }) => startSession(id, type, { replay: true }));
route('/practice/:id/:type/resume', resumeSession);
route('/review', reviewScreen);
route('/questions', questionsScreen);
route('/progress', progressScreen);
route('/help', helpScreen);

fallback(() => go('/'));

startRouter();

// Two settings are honoured through data- attributes on the root element.
function applySettings() {
  const { textSize, reducedMotion } = settings();
  const root = document.documentElement;
  if (textSize && textSize !== 'normal') root.dataset.textSize = textSize;
  if (reducedMotion) root.dataset.reducedMotion = 'true';
}
