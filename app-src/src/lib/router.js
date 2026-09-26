// Hash routing, so a static host needs no server configuration for deep links.

const routes = [];
let notFound = () => {};

function compile(pattern) {
  const names = [];
  const source = pattern
    .replace(/[.+*?^${}()|[\]\\]/g, '\\$&')
    .replace(/:(\w+)/g, (_, name) => {
      names.push(name);
      return '([^/]+)';
    });
  return { regex: new RegExp(`^${source}$`), names };
}

export function route(pattern, handler) {
  routes.push({ ...compile(pattern), handler });
}

export function fallback(handler) {
  notFound = handler;
}

export function go(path, { replace = false } = {}) {
  if (currentPath() === path) {
    resolve();
  } else if (replace) {
    window.location.replace(`#${path}`);
  } else {
    window.location.hash = path;
  }
}

// The previous screen, or `fallbackPath` when the app was opened on this one.
export function back(fallbackPath = '/') {
  if (window.history.length > 1) window.history.back();
  else go(fallbackPath, { replace: true });
}

// Draws the current screen again, for example once someone has signed in.
export function refresh() {
  resolve();
}

export function currentPath() {
  const hash = window.location.hash.slice(1);
  return hash || '/';
}

function resolve() {
  const path = currentPath();

  for (const { regex, names, handler } of routes) {
    const match = path.match(regex);
    if (!match) continue;
    const params = {};
    names.forEach((name, i) => {
      params[name] = decodeURIComponent(match[i + 1]);
    });
    handler(params);
    return;
  }

  notFound();
}

export function startRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
