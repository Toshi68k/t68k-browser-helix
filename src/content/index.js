/**
 * T68k Browser Helix - Content Script Entry Point
 */

import { initShadowRoot, setTheme } from './ui/shadow-root.js';
import { statusLine } from './ui/statusline.js';
import { stateManager, MODES, isEditableElement, getDeepActiveElement } from './state.js';
import { keyDispatcher } from './keymap/helix-keys.js';
import { hintManager } from './ui/hints.js';
import { scroller } from './navigation/scroller.js';

async function initHelix() {
  // Load settings
  let settings = {
    theme: 'helix_dark',
    scrollStep: 80,
    scrollHalfRatio: 0.5,
    hintCharacters: 'fjdkslaeiruvncmghwoqptyzb',
    smoothScroll: true,
    escapeSequence: 'jk',
    blacklist: []
  };

  try {
    const res = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (res && res.settings) {
      settings = { ...settings, ...res.settings };
    }
  } catch (e) {
    console.warn('[Helix] Could not load background settings:', e);
  }

  // Check URL blacklist
  const currentUrl = window.location.href;
  const isExcluded = (settings.blacklist || []).some(pattern => {
    try {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(currentUrl);
    } catch (e) {
      return false;
    }
  });

  if (isExcluded) {
    stateManager.isBlacklisted = true;
    console.log('[Helix] Disabled on blacklisted URL:', currentUrl);
    return;
  }

  // Configure modules with user settings
  scroller.updateSettings({
    step: settings.scrollStep,
    smooth: settings.smoothScroll,
    halfPageRatio: settings.scrollHalfRatio
  });
  hintManager.setHintCharacters(settings.hintCharacters);
  keyDispatcher.escapeSequence = settings.escapeSequence || 'jk';
  stateManager.setKeyDispatcher(keyDispatcher);

  // Initialize isolated Shadow DOM
  await initShadowRoot(settings.theme || 'helix_dark');

  // Sync mode with current focus before/during mounting status line
  syncModeWithFocus();

  // Mount Helix Status Line
  statusLine.mount(stateManager.getMode(), stateManager.getModeLabel());

  // Listen to Storage updates (e.g. options page changes)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.settings) {
      const newSettings = changes.settings.newValue;
      if (newSettings) {
        if (newSettings.theme) setTheme(newSettings.theme);
        if (newSettings.hintCharacters) hintManager.setHintCharacters(newSettings.hintCharacters);
        if (newSettings.scrollStep) scroller.updateSettings({ step: newSettings.scrollStep });
        if (newSettings.escapeSequence) keyDispatcher.escapeSequence = newSettings.escapeSequence;
      }
    }
  });

  // Attach global keyboard listener in Capture phase
  window.addEventListener(
    'keydown',
    (e) => {
      keyDispatcher.handleKeyDown(e);
    },
    true // Capture phase to guarantee priority in Normal mode
  );

  // Auto-switch to INSERT mode when user clicks or focuses editable inputs
  const handleFocusIn = (e) => {
    const mode = stateManager.getMode();
    if (
      mode === MODES.SEARCH ||
      mode === MODES.COMMAND ||
      mode === MODES.PICKER ||
      mode === MODES.HINT ||
      mode === MODES.SPACE_MENU ||
      mode === MODES.GOTO_MENU ||
      mode === MODES.BRACKET_NEXT ||
      mode === MODES.BRACKET_PREV ||
      mode === MODES.YANK_MENU ||
      mode === MODES.ZOOM_MENU
    ) {
      return;
    }
    const target = e.target;
    if (isEditableElement(target)) {
      if (mode !== MODES.INSERT) {
        stateManager.setMode(MODES.INSERT);
      }
    }
  };

  window.addEventListener('focusin', handleFocusIn, true);
  window.addEventListener('focus', handleFocusIn, true);

  const handleFocusOut = (e) => {
    const mode = stateManager.getMode();
    if (mode !== MODES.INSERT) return;
    const target = e.target;
    if (isEditableElement(target)) {
      setTimeout(() => {
        if (!isEditableElement(getDeepActiveElement()) && stateManager.getMode() === MODES.INSERT) {
          stateManager.setMode(MODES.NORMAL);
        }
      }, 50);
    }
  };

  window.addEventListener('focusout', handleFocusOut, true);

  // Lifecycle listeners to catch autofocused inputs on reload / navigation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncModeWithFocus);
  } else {
    syncModeWithFocus();
  }
  window.addEventListener('load', syncModeWithFocus);
  window.addEventListener('pageshow', syncModeWithFocus);

  // Staggered checks to catch deferred scripts/frameworks autofocusing inputs after reload
  [0, 50, 150, 300, 600, 1000].forEach((delay) => {
    setTimeout(syncModeWithFocus, delay);
  });

  // Observe dynamically inserted autofocus elements (e.g. form reload / AJAX)
  try {
    const autofocusObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (let i = 0; i < m.addedNodes.length; i++) {
          const node = m.addedNodes[i];
          if (node.nodeType === 1) {
            if (node.hasAttribute?.('autofocus') || (node.firstElementChild && node.querySelector?.('[autofocus]'))) {
              syncModeWithFocus();
              return;
            }
          }
        }
      }
    });
    autofocusObserver.observe(document.documentElement || document, { childList: true, subtree: true });
    setTimeout(() => autofocusObserver.disconnect(), 5000);
  } catch (e) {}

  console.log('[Helix] Browser Navigation active. Press Space or ? for help.');
}

function syncModeWithFocus() {
  if (stateManager.isBlacklisted) return;
  const activeEl = getDeepActiveElement();
  if (isEditableElement(activeEl)) {
    const mode = stateManager.getMode();
    if (
      mode !== MODES.INSERT &&
      mode !== MODES.SEARCH &&
      mode !== MODES.COMMAND &&
      mode !== MODES.PICKER &&
      mode !== MODES.HINT
    ) {
      stateManager.setMode(MODES.INSERT);
    }
  } else {
    // Check if there is an autofocus element that the browser should focus
    const autofocusEl = document.querySelector('input[autofocus], textarea[autofocus], [contenteditable="true"][autofocus]');
    if (autofocusEl && isEditableElement(autofocusEl) && (!document.activeElement || document.activeElement === document.body)) {
      try {
        autofocusEl.focus();
        if (stateManager.getMode() !== MODES.INSERT) {
          stateManager.setMode(MODES.INSERT);
        }
      } catch (e) {}
    }
  }
}

// Start
initHelix();
