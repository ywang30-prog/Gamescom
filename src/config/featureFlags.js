/**
 * Feature flags.
 *
 * Defaults live in DEFAULTS below — flip one to `true` to ship it to everyone.
 *
 * For user testing you can override a flag per-session from the URL, without
 * a rebuild:
 *
 *   ?ff=mouseClickTrigger     enable it
 *   ?ff=-mouseClickTrigger    force it off
 *   ?ff=a,-b                  several at once
 *   ?ff=reset                 clear all overrides, back to DEFAULTS
 *
 * The override is remembered in sessionStorage, so it survives in-app
 * navigation and reloads, and disappears when the tab is closed.
 */

const DEFAULTS = {
  // Triggers page: "Switch to mouse click trigger" toggle.
  // Hidden 2026-09-07 — kept behind the flag for future user testing.
  mouseClickTrigger: false,
};

const STORAGE_KEY = 'featureFlagOverrides';

function readOverrides() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function resolve() {
  if (typeof window === 'undefined') return { ...DEFAULTS };

  let overrides = readOverrides();
  const param = new URLSearchParams(window.location.search).get('ff');

  if (param !== null) {
    if (param === 'reset' || param === 'none') {
      overrides = {};
    } else {
      for (const raw of param.split(',')) {
        const token = raw.trim();
        if (!token) continue;
        const off = token.startsWith('-');
        const name = off ? token.slice(1) : token;
        if (name in DEFAULTS) overrides[name] = !off;
      }
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      // Private browsing / storage disabled — the flag still applies to this page load.
    }
  }

  return { ...DEFAULTS, ...overrides };
}

export const FEATURES = resolve();
