import './styles/app.css';

import { el } from './lib/dom.js';
import { route, fallback, startRouter, go } from './lib/router.js';
import { setupPWA } from './lib/pwa.js';
import { initInstall } from './lib/install.js';
import { restore, needsSignIn } from './lib/account.js';
import { mountShell, focusScreen } from './ui/shell.js';
import { homeScreen } from './screens/home.js';
import { topicsScreen } from './screens/topics.js';
import { activitiesScreen } from './screens/activities.js';
import { sessionScreen } from './screens/session.js';
import { reviewScreen } from './screens/review.js';
import { questionsScreen } from './screens/questions.js';
import { progressScreen } from './screens/progress.js';
import { helpScreen } from './screens/help.js';
import { settingsScreen } from './screens/settings.js';
import { profileScreen } from './screens/profile.js';
import { signinScreen } from './screens/signin.js';
import { studentsScreen, studentScreen } from './screens/students.js';

// Listen straight away: the browser may offer installing before any screen draws.
initInstall();
setupPWA();

mountShell(document.getElementById('app'));

// Wraps a screen so nobody gets past the sign-in page without choosing Google
// or guest, and so focus lands on the new screen after every navigation.
const screen = (render) => (params) => {
  if (needsSignIn()) signinScreen();
  else render(params);
  focusScreen();
};

route('/', screen(homeScreen));
route('/topics', screen(topicsScreen));
route('/topic/:id', screen(activitiesScreen));
route('/practice/:id/:type', screen((p) => sessionScreen({ ...p, mode: 'new' })));
route('/practice/:id/:type/replay', screen((p) => sessionScreen({ ...p, mode: 'replay' })));
// Links saved by the first version. Carrying on is now automatic.
route('/practice/:id/:type/resume', screen((p) => sessionScreen({ ...p, mode: 'new' })));
route('/review', screen(reviewScreen));
route('/questions', screen(questionsScreen));
route('/progress', screen(progressScreen));
route('/help', screen(helpScreen));
route('/settings', screen(settingsScreen));
route('/profile', screen(profileScreen));
route('/students', screen(studentsScreen));
route('/student/:uid', screen(studentScreen));

fallback(() => go('/', { replace: true }));

document.getElementById('screen-body').append(
  el('p', { class: 'loading', role: 'status', text: 'Loading…' })
);

restore().finally(startRouter);
