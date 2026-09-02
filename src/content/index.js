/**
 * T68k Browser Helix - Content Script Entry Point
 */

import { initShadowRoot, setTheme } from './ui/shadow-root.js';
import { statusLine } from './ui/statusline.js';
import { stateManager, MODES } from './state.js';
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

  // Mount Helix Status Line
  statusLine.mount();

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
  window.addEventListener('focusin', (e) => {
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
  });

  window.addEventListener('focusout', (e) => {
    const mode = stateManager.getMode();
    if (mode !== MODES.INSERT) return;
    const target = e.target;
    if (isEditableElement(target)) {
      setTimeout(() => {
        if (!isEditableElement(document.activeElement) && stateManager.getMode() === MODES.INSERT) {
          stateManager.setMode(MODES.NORMAL);
        }
      }, 50);
    }
  });

  console.log('[Helix] Browser Navigation active. Press Space or ? for help.');
}

function isEditableElement(el) {
  if (!el) return false;
  // Ignore any element inside the Helix Shadow DOM
  const root = typeof el.getRootNode === 'function' ? el.getRootNode() : null;
  if (root && root instanceof ShadowRoot) return false;
  if (el.closest && el.closest('#helix-chrome-root')) return false;

  const tag = el.tagName ? el.tagName.toLowerCase() : '';
  return (
    (tag === 'input' && !['button', 'submit', 'checkbox', 'radio', 'file', 'hidden', 'image', 'reset'].includes(el.type)) ||
    tag === 'textarea' ||
    el.isContentEditable ||
    el.getAttribute?.('role') === 'textbox'
  );
}

// Start
initHelix();
