/**
 * Helix Modal State Machine
 */

import { statusLine } from './ui/statusline.js';
import { whichKey } from './ui/which-key.js';
import { hintManager } from './ui/hints.js';
import { visualCaret } from './navigation/visual-caret.js';
import { searchBar } from './ui/search-bar.js';
import { commandBar } from './ui/command-bar.js';
import { tabPicker } from './ui/tab-picker.js';

export const MODES = {
  NORMAL: 'NORMAL',
  INSERT: 'INSERT',
  HINT: 'HINT',
  SELECT: 'SELECT',
  SEARCH: 'SEARCH',
  COMMAND: 'COMMAND',
  PICKER: 'PICKER',
  SPACE_MENU: 'SPACE_MENU',
  GOTO_MENU: 'GOTO_MENU',
  BRACKET_NEXT: 'BRACKET_NEXT',
  BRACKET_PREV: 'BRACKET_PREV',
  YANK_MENU: 'YANK_MENU',
  ZOOM_MENU: 'ZOOM_MENU'
};

const MODE_LABELS = {
  NORMAL: 'NOR',
  INSERT: 'INS',
  HINT: 'HNT',
  SELECT: 'SEL',
  SEARCH: 'SRC',
  COMMAND: 'CMD',
  PICKER: 'PCK',
  SPACE_MENU: 'SPC',
  GOTO_MENU: 'GTO',
  BRACKET_NEXT: ']',
  BRACKET_PREV: '[',
  YANK_MENU: 'YNK',
  ZOOM_MENU: 'ZOM'
};

export class StateManager {
  constructor() {
    this.currentMode = MODES.NORMAL;
    this.keyBuffer = '';
    this.countPrefix = null;
    this.isBlacklisted = false;
    this.keyDispatcher = null;
  }

  setKeyDispatcher(dispatcher) {
    this.keyDispatcher = dispatcher;
  }

  getMode() {
    return this.currentMode;
  }

  isNormal() {
    return this.currentMode === MODES.NORMAL;
  }

  isInsert() {
    return this.currentMode === MODES.INSERT;
  }

  setMode(mode, options = {}) {
    const prevMode = this.currentMode;
    this.currentMode = mode;
    this.clearKeyBuffer();

    // Update status bar UI
    statusLine.setMode(mode, MODE_LABELS[mode] || mode);

    // Cleanup previous mode actions if needed
    if (prevMode === MODES.SELECT && mode !== MODES.SELECT) {
      visualCaret.stop();
    }
    if (prevMode === MODES.HINT && mode !== MODES.HINT) {
      hintManager.clear();
    }
    if (prevMode === MODES.SEARCH && mode !== MODES.SEARCH && searchBar.isOpen) {
      searchBar.close();
    }
    if (prevMode === MODES.COMMAND && mode !== MODES.COMMAND && commandBar.isOpen) {
      commandBar.close();
    }
    if (prevMode === MODES.PICKER && mode !== MODES.PICKER && tabPicker.isOpen) {
      tabPicker.close();
    }
    if (prevMode !== MODES.SPACE_MENU &&
        prevMode !== MODES.GOTO_MENU &&
        prevMode !== MODES.BRACKET_NEXT &&
        prevMode !== MODES.BRACKET_PREV &&
        prevMode !== MODES.YANK_MENU &&
        prevMode !== MODES.ZOOM_MENU) {
      // Keep whichKey if transitioning between submenus
    } else if (!mode.includes('MENU') && !mode.includes('BRACKET')) {
      whichKey.hide();
    }

    // Initialize new mode
    switch (mode) {
      case MODES.NORMAL:
        break;

      case MODES.INSERT:
        break;

      case MODES.SELECT:
        visualCaret.start();
        break;

      case MODES.HINT:
        hintManager.start(options.hintAction || 'click', () => {
          this.setMode(MODES.NORMAL);
        });
        break;

      case MODES.SPACE_MENU:
        whichKey.show('space', (key) => this.handleMenuSelection(key));
        break;

      case MODES.GOTO_MENU:
        whichKey.show('goto', (key) => this.handleMenuSelection(key));
        break;

      case MODES.BRACKET_NEXT:
        whichKey.show('bracket_next', (key) => this.handleMenuSelection(key));
        break;

      case MODES.BRACKET_PREV:
        whichKey.show('bracket_prev', (key) => this.handleMenuSelection(key));
        break;

      case MODES.YANK_MENU:
        whichKey.show('yank', (key) => this.handleMenuSelection(key));
        break;

      case MODES.ZOOM_MENU:
        whichKey.show('zoom', (key) => this.handleMenuSelection(key));
        break;

      case MODES.SEARCH:
        searchBar.open(options.direction || 'forward', () => {
          this.setMode(MODES.NORMAL);
        });
        break;

      case MODES.COMMAND:
        commandBar.open(options.initialValue || '', () => {
          this.setMode(MODES.NORMAL);
        });
        break;

      case MODES.PICKER:
        tabPicker.open(options.pickerType || 'tabs', () => {
          this.setMode(MODES.NORMAL);
        });
        break;
    }
  }

  handleMenuSelection(key) {
    if (!this.keyDispatcher) return;
    const mode = this.currentMode;
    if (mode === MODES.SPACE_MENU) this.keyDispatcher.handleSpaceMenuKey(key);
    else if (mode === MODES.GOTO_MENU) this.keyDispatcher.handleGotoMenuKey(key);
    else if (mode === MODES.BRACKET_NEXT || mode === MODES.BRACKET_PREV) this.keyDispatcher.handleBracketKey(mode, key);
    else if (mode === MODES.YANK_MENU) this.keyDispatcher.handleYankMenuKey(key);
    else if (mode === MODES.ZOOM_MENU) this.keyDispatcher.handleZoomMenuKey(key);
  }

  setKeyBuffer(str) {
    this.keyBuffer = str;
    statusLine.setKeys(str);
  }

  appendKeyBuffer(char) {
    this.keyBuffer += char;
    statusLine.setKeys(this.keyBuffer);
  }

  clearKeyBuffer() {
    this.keyBuffer = '';
    this.countPrefix = null;
    statusLine.setKeys('');
  }
}

export const stateManager = new StateManager();
