import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
function snapshot() {
  const hash = window.location.hash.slice(1);
  const legacy: Record<string, string> = {
    about: '/about',
    skills: '/skills',
    experience: '/experience',
    projects: '/projects',
    certifications: '/about',
    contact: '/contact',
  };
  return legacy[hash] || hash || '/';
}
// Hash routes survive direct visits and refreshes on GitHub Pages, including its repository base path.
export function useRoute() {
  return useSyncExternalStore(subscribe, snapshot, () => '/');
}
