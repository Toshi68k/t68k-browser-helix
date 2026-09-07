import { MODES, stateManager, isEditableElement, getDeepActiveElement } from '../state.js';
import { scroller } from '../navigation/scroller.js';
import { Traversal } from '../navigation/traversal.js';
import { visualCaret } from '../navigation/visual-caret.js';
import { jumpList } from '../navigation/jump-list.js';
import { CliUtils } from '../navigation/cli-utils.js';
import { hintManager } from '../ui/hints.js';
import { searchBar } from '../ui/search-bar.js';
import { tabPicker } from '../ui/tab-picker.js';
import { statusLine } from '../ui/statusline.js';
import { readerMode } from '../ui/reader.js';

export class KeyDispatcher {
  constructor() {
    this.escapeSequence = 'jk';
    this.lastKeyPressTime = 0;
    this.lastRawKey = '';
  }

  handleKeyDown(event) {
    // If blacklisted, ignore
    if (stateManager.isBlacklisted) return;

    // Check if Reader mode is open
    if (readerMode.isOpen) {
      if (event.key === 'Escape' || event.key === 'q') {
        event.preventDefault();
        event.stopPropagation();
        readerMode.close();
        return;
      }
    }

    const mode = stateManager.getMode();
    const key = event.key;
    const ctrl = event.ctrlKey;
    const meta = event.metaKey;
    const alt = event.altKey;

    // If an editable element is focused, ensure we are in INSERT mode (unless in modal overlays like search/command/picker)
    const activeEl = getDeepActiveElement();
    const hasEditableFocus = isEditableElement(activeEl);

    if (
      hasEditableFocus &&
      mode !== MODES.INSERT &&
      mode !== MODES.SEARCH &&
      mode !== MODES.COMMAND &&
      mode !== MODES.PICKER
    ) {
      // If the user presses Escape, blur the input and stay/enter Normal mode
      if (key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.exitInsertMode();
        return;
      }
      // Otherwise auto-sync to INSERT mode so user keystrokes are not swallowed by Helix
      stateManager.setMode(MODES.INSERT);
      // Let host page/input handle the keystroke
      this.lastRawKey = key;
      this.lastKeyPressTime = Date.now();
      return;
    }

    // Fast-escape sequence in INSERT mode (e.g. 'jk' or 'fd')
    if (mode === MODES.INSERT) {
      if (key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.exitInsertMode();
        return;
      }
      
      const now = Date.now();
      if (this.escapeSequence.length === 2 && now - this.lastKeyPressTime < 350) {
        if (this.lastRawKey === this.escapeSequence[0] && key === this.escapeSequence[1]) {
          event.preventDefault();
          event.stopPropagation();
          // Remove last typed char if in input
          const active = document.activeElement;
          if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
            if (active.value && active.value.endsWith(this.escapeSequence[0])) {
              active.value = active.value.slice(0, -1);
            }
          }
          this.exitInsertMode();
          return;
        }
      }
      this.lastRawKey = key;
      this.lastKeyPressTime = now;
      return; // let host page handle insert keys
    }

    // Modal input capture modes (SearchBar, CommandBar, TabPicker) handle their own input
    if (mode === MODES.SEARCH) {
      if (key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        searchBar.close();
        return;
      }
      if (searchBar.isOpen && searchBar.inputEl && document.activeElement !== searchBar.inputEl) {
        searchBar.inputEl.focus();
      }
      return;
    }

    if (mode === MODES.COMMAND) {
      if (key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        commandBar.close();
        return;
      }
      if (commandBar.isOpen && commandBar.inputEl && document.activeElement !== commandBar.inputEl) {
        commandBar.inputEl.focus();
      }
      return;
    }

    if (mode === MODES.PICKER || tabPicker.isOpen) {
      if (key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        tabPicker.close();
        return;
      }
      if (tabPicker.isOpen && tabPicker.searchEl && document.activeElement !== tabPicker.searchEl) {
        tabPicker.searchEl.focus();
      }
      return;
    }

    // Hint Mode
    if (mode === MODES.HINT) {
      event.preventDefault();
      event.stopPropagation();
      if (key === 'Escape') {
        stateManager.setMode(MODES.NORMAL);
      } else if (/^[a-zA-Z]$/.test(key)) {
        hintManager.handleKey(key);
      }
      return;
    }

    // Which-Key / Submenu Modes
    if (mode === MODES.SPACE_MENU) {
      event.preventDefault();
      event.stopPropagation();
      this.handleSpaceMenuKey(key);
      return;
    }

    if (mode === MODES.GOTO_MENU) {
      event.preventDefault();
      event.stopPropagation();
      this.handleGotoMenuKey(key);
      return;
    }

    if (mode === MODES.BRACKET_NEXT || mode === MODES.BRACKET_PREV) {
      event.preventDefault();
      event.stopPropagation();
      this.handleBracketKey(mode, key);
      return;
    }

    if (mode === MODES.YANK_MENU) {
      event.preventDefault();
      event.stopPropagation();
      this.handleYankMenuKey(key);
      return;
    }

    if (mode === MODES.ZOOM_MENU) {
      event.preventDefault();
      event.stopPropagation();
      this.handleZoomMenuKey(key);
      return;
    }

    // Visual / Selection Mode
    if (mode === MODES.SELECT) {
      if (key === 'Escape' || key === 'v') {
        event.preventDefault();
        event.stopPropagation();
        stateManager.setMode(MODES.NORMAL);
        return;
      }
      this.handleSelectModeKey(event);
      return;
    }

    // Normal Mode Navigation
    if (mode === MODES.NORMAL) {
      // Don't intercept browser-native shortcuts with Ctrl/Cmd like Ctrl-T, Ctrl-W, Cmd-R unless specifically mapped
      if ((ctrl || meta) && !['d', 'u', 'f', 'b', 'i', 'o', 'j', 'k'].includes(key.toLowerCase())) {
        return;
      }

      this.handleNormalModeKey(event);
    }
  }

  handleNormalModeKey(event) {
    const key = event.key;
    const ctrl = event.ctrlKey;

    // Jump List: Ctrl-o (back), Ctrl-i (forward)
    if (ctrl && key.toLowerCase() === 'o') {
      event.preventDefault();
      event.stopPropagation();
      jumpList.jumpBack();
      return;
    }
    if (ctrl && key.toLowerCase() === 'i') {
      event.preventDefault();
      event.stopPropagation();
      jumpList.jumpForward();
      return;
    }

    // Number prefix accumulation (e.g. 5j, 10k)
    if (/^[0-9]$/.test(key) && !(key === '0' && stateManager.keyBuffer === '')) {
      event.preventDefault();
      event.stopPropagation();
      stateManager.appendKeyBuffer(key);
      return;
    }

    const count = parseInt(stateManager.keyBuffer, 10) || 1;

    // Escape clears state
    if (key === 'Escape') {
      event.preventDefault();
      stateManager.clearKeyBuffer();
      if (document.activeElement) document.activeElement.blur();
      return;
    }

    // Scrolling commands
    if (key === 'j' || (!ctrl && key === 'ArrowDown')) {
      event.preventDefault();
      scroller.down(count);
      stateManager.clearKeyBuffer();
      return;
    }
    if (key === 'k' || (!ctrl && key === 'ArrowUp')) {
      event.preventDefault();
      scroller.up(count);
      stateManager.clearKeyBuffer();
      return;
    }
    if (key === 'h' || (!ctrl && key === 'ArrowLeft')) {
      event.preventDefault();
      scroller.left(count);
      stateManager.clearKeyBuffer();
      return;
    }
    if (key === 'l' || (!ctrl && key === 'ArrowRight')) {
      event.preventDefault();
      scroller.right(count);
      stateManager.clearKeyBuffer();
      return;
    }
    if (key === 'd' || (ctrl && key === 'd')) {
      event.preventDefault();
      scroller.halfPageDown();
      stateManager.clearKeyBuffer();
      return;
    }
    if (key === 'u' || (ctrl && key === 'u')) {
      event.preventDefault();
      scroller.halfPageUp();
      stateManager.clearKeyBuffer();
      return;
    }
    if (ctrl && key === 'f') {
      event.preventDefault();
      scroller.pageDown();
      stateManager.clearKeyBuffer();
      return;
    }
    if (ctrl && key === 'b') {
      event.preventDefault();
      scroller.pageUp();
      stateManager.clearKeyBuffer();
      return;
    }

    // Modal Mode transitions
    if (key === ' ') {
      event.preventDefault();
      stateManager.setMode(MODES.SPACE_MENU);
      return;
    }
    if (key === 'g') {
      event.preventDefault();
      stateManager.setMode(MODES.GOTO_MENU);
      return;
    }
    if (key === ']') {
      event.preventDefault();
      stateManager.setMode(MODES.BRACKET_NEXT);
      return;
    }
    if (key === '[') {
      event.preventDefault();
      stateManager.setMode(MODES.BRACKET_PREV);
      return;
    }
    if (key === 'y') {
      event.preventDefault();
      stateManager.setMode(MODES.YANK_MENU);
      return;
    }
    if (key === 'z') {
      event.preventDefault();
      stateManager.setMode(MODES.ZOOM_MENU);
      return;
    }
    if (key === 'f') {
      event.preventDefault();
      jumpList.recordPosition();
      stateManager.setMode(MODES.HINT, { hintAction: 'click' });
      return;
    }
    if (key === 'F') {
      event.preventDefault();
      stateManager.setMode(MODES.HINT, { hintAction: 'newTab' });
      return;
    }
    if (key === 'v') {
      event.preventDefault();
      stateManager.setMode(MODES.SELECT);
      return;
    }
    if (key === '/') {
      event.preventDefault();
      jumpList.recordPosition();
      stateManager.setMode(MODES.SEARCH, { direction: 'forward' });
      return;
    }
    if (key === '?') {
      event.preventDefault();
      jumpList.recordPosition();
      stateManager.setMode(MODES.SEARCH, { direction: 'backward' });
      return;
    }
    if (key === ':') {
      event.preventDefault();
      stateManager.setMode(MODES.COMMAND);
      return;
    }
    if (key === 'i') {
      event.preventDefault();
      this.focusFirstInput();
      return;
    }

    // Search navigation (n / N)
    if (key === 'n') {
      event.preventDefault();
      jumpList.recordPosition();
      searchBar.findNext();
      return;
    }
    if (key === 'N') {
      event.preventDefault();
      jumpList.recordPosition();
      searchBar.findPrevious();
      return;
    }

    // Fast Tab / History shortcuts
    if (key === 'J' || key === 'gt') {
      event.preventDefault();
      chrome.runtime.sendMessage({ type: 'NEXT_TAB' });
      return;
    }
    if (key === 'K' || key === 'gp') {
      event.preventDefault();
      chrome.runtime.sendMessage({ type: 'PREV_TAB' });
      return;
    }
    if (key === 'H') {
      event.preventDefault();
      window.history.back();
      return;
    }
    if (key === 'L') {
      event.preventDefault();
      window.history.forward();
      return;
    }
    if (key === 'r') {
      event.preventDefault();
      window.location.reload();
      return;
    }
    if (key === 'R') {
      event.preventDefault();
      window.location.reload(true);
      return;
    }
    if (key === 'x') {
      event.preventDefault();
      stateManager.setMode(MODES.SELECT);
      visualCaret.selectLineOrBlock();
      return;
    }
    if (key === 'p') {
      event.preventDefault();
      this.pasteAndOpen(false);
      return;
    }
    if (key === 'P') {
      event.preventDefault();
      this.pasteAndOpen(true);
      return;
    }
  }

  handleSelectModeKey(event) {
    const key = event.key;
    event.preventDefault();
    event.stopPropagation();

    switch (key) {
      case 'h':
      case 'ArrowLeft':
        visualCaret.move('left');
        break;
      case 'l':
      case 'ArrowRight':
        visualCaret.move('right');
        break;
      case 'j':
      case 'ArrowDown':
        visualCaret.move('down');
        break;
      case 'k':
      case 'ArrowUp':
        visualCaret.move('up');
        break;
      case 'w':
      case 'e':
        visualCaret.move('word_forward');
        break;
      case 'b':
        visualCaret.move('word_backward');
        break;
      case 'x':
        visualCaret.selectLineOrBlock();
        break;
      case 'y': {
        const text = visualCaret.yank();
        statusLine.setMessage(`Yanked ${text.length} chars to clipboard`);
        stateManager.setMode(MODES.NORMAL);
        break;
      }
    }
  }

  handleSpaceMenuKey(key) {
    if (key === 'Escape' || key === ' ') {
      stateManager.setMode(MODES.NORMAL);
      return;
    }

    switch (key) {
      case 'b':
        stateManager.setMode(MODES.PICKER, { pickerType: 'tabs' });
        break;
      case 'f':
        stateManager.setMode(MODES.PICKER, { pickerType: 'bookmarks' });
        break;
      case 'h':
        stateManager.setMode(MODES.PICKER, { pickerType: 'history' });
        break;
      case 'z':
        stateManager.setMode(MODES.NORMAL);
        readerMode.toggle();
        break;
      case 'p':
        stateManager.setMode(MODES.NORMAL);
        chrome.runtime.sendMessage({ type: 'TOGGLE_PIN_TAB' }).then(res => {
          statusLine.setMessage(res?.pinned ? 'Tab pinned' : 'Tab unpinned');
        });
        break;
      case 'm':
        stateManager.setMode(MODES.NORMAL);
        chrome.runtime.sendMessage({ type: 'TOGGLE_MUTE_TAB' }).then(res => {
          statusLine.setMessage(res?.muted ? 'Tab muted' : 'Tab unmuted');
        });
        break;
      case 's':
        stateManager.setMode(MODES.NORMAL);
        chrome.runtime.sendMessage({ type: 'SPLIT_WINDOW' });
        statusLine.setMessage('Tiled window split');
        break;
      case 'y':
        stateManager.setMode(MODES.NORMAL);
        navigator.clipboard.writeText(window.location.href);
        statusLine.setMessage('Yanked URL to clipboard');
        break;
      case 't':
        stateManager.setMode(MODES.NORMAL);
        navigator.clipboard.writeText(document.title);
        statusLine.setMessage('Yanked page title to clipboard');
        break;
      case 'w':
        stateManager.setMode(MODES.NORMAL);
        chrome.runtime.sendMessage({ type: 'CLOSE_TAB' });
        break;
      case 'u':
        stateManager.setMode(MODES.NORMAL);
        chrome.runtime.sendMessage({ type: 'RESTORE_TAB' });
        break;
      case 'n':
        stateManager.setMode(MODES.NORMAL);
        chrome.runtime.sendMessage({ type: 'NEW_TAB', active: true });
        break;
      case 'd':
        stateManager.setMode(MODES.NORMAL);
        chrome.runtime.sendMessage({ type: 'DUPLICATE_TAB' });
        break;
      case 'o':
        stateManager.setMode(MODES.NORMAL);
        chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
        break;
      default:
        stateManager.setMode(MODES.NORMAL);
        break;
    }
  }

  handleGotoMenuKey(key) {
    stateManager.setMode(MODES.NORMAL);
    switch (key) {
      case 'g':
        jumpList.recordPosition();
        scroller.top();
        break;
      case 'e':
        jumpList.recordPosition();
        scroller.bottom();
        break;
      case 'a':
        chrome.runtime.sendMessage({ type: 'SWITCH_ALTERNATE_TAB' });
        break;
      case 'i':
        this.focusFirstInput();
        break;
      case 's':
        if (!window.location.href.startsWith('view-source:')) {
          window.location.href = 'view-source:' + window.location.href;
        }
        break;
      case 'h':
        window.history.back();
        break;
      case 'l':
        window.history.forward();
        break;
      case 't':
        chrome.runtime.sendMessage({ type: 'NEXT_TAB' });
        break;
      case 'p':
        chrome.runtime.sendMessage({ type: 'PREV_TAB' });
        break;
      case 'u': {
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          pathSegments.pop();
          url.pathname = '/' + pathSegments.join('/');
          window.location.href = url.toString();
        } else {
          window.location.href = url.origin;
        }
        break;
      }
      case 'r':
        window.location.reload();
        break;
      case 'R':
        window.location.reload(true);
        break;
    }
  }

  handleBracketKey(mode, key) {
    stateManager.setMode(MODES.NORMAL);
    const direction = mode === MODES.BRACKET_NEXT ? 'next' : 'prev';

    if (key === 't') {
      if (direction === 'next') chrome.runtime.sendMessage({ type: 'NEXT_TAB' });
      else chrome.runtime.sendMessage({ type: 'PREV_TAB' });
      return;
    }

    if (['h', 'l', 'i', 'b', 'p', 'c'].includes(key)) {
      const jumped = Traversal.jump(key, direction);
      if (!jumped) {
        statusLine.setMessage(`No ${direction} element found for [${key}]`);
      }
    }
  }

  handleYankMenuKey(key) {
    stateManager.setMode(MODES.NORMAL);
    switch (key) {
      case 'c': {
        const code = Traversal.getNearestCodeSnippet();
        if (code) {
          navigator.clipboard.writeText(code);
          statusLine.setMessage(`Yanked code snippet (${code.length} chars)`);
        } else {
          statusLine.setMessage('No code snippet found near viewport');
        }
        break;
      }
      case 'm':
        CliUtils.yankMarkdown();
        break;
      case 'T':
      case 't':
        CliUtils.yankTable();
        break;
      case 'g':
        CliUtils.yankGitUrl();
        break;
      case 'l':
        CliUtils.yankMarkdownLink();
        break;
      case 'y':
        navigator.clipboard.writeText(window.location.href);
        statusLine.setMessage('Yanked URL to clipboard');
        break;
      case 'p':
        navigator.clipboard.writeText(document.title);
        statusLine.setMessage('Yanked page title to clipboard');
        break;
      case 'f':
        stateManager.setMode(MODES.HINT, { hintAction: 'yank' });
        break;
      case 's': {
        const text = window.getSelection().toString();
        if (text) {
          navigator.clipboard.writeText(text);
          statusLine.setMessage(`Yanked selection (${text.length} chars)`);
        }
        break;
      }
    }
  }

  handleZoomMenuKey(key) {
    stateManager.setMode(MODES.NORMAL);
    switch (key) {
      case 'i':
        chrome.runtime.sendMessage({ type: 'ZOOM', action: 'in' });
        break;
      case 'o':
        chrome.runtime.sendMessage({ type: 'ZOOM', action: 'out' });
        break;
      case '0':
        chrome.runtime.sendMessage({ type: 'ZOOM', action: 'reset' });
        break;
      case 'z': {
        window.scrollBy({ top: 0, behavior: 'smooth' });
        break;
      }
    }
  }

  focusFirstInput() {
    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]'))
      .filter(el => {
        if (el.closest('#helix-chrome-root')) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
      });

    if (inputs.length > 0) {
      // Prioritize search inputs or main text inputs
      const searchInput = inputs.find(el => el.type === 'search' || el.name?.includes('q') || el.id?.includes('search') || el.placeholder?.toLowerCase().includes('search')) || inputs[0];
      jumpList.recordPosition();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
      stateManager.setMode(MODES.INSERT);
      statusLine.setMessage('Focused input (Insert mode)');
    } else {
      stateManager.setMode(MODES.INSERT);
    }
  }

  async pasteAndOpen(newTab = false) {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      const url = text.includes('.') && !text.includes(' ')
        ? (text.includes('://') ? text : `https://${text}`)
        : `https://www.google.com/search?q=${encodeURIComponent(text)}`;
      
      if (newTab) {
        chrome.runtime.sendMessage({ type: 'NEW_TAB', url, active: true });
      } else {
        window.location.href = url;
      }
    } catch (e) {
      statusLine.setMessage('Clipboard access denied');
    }
  }

  exitInsertMode() {
    if (document.activeElement) {
      document.activeElement.blur();
    }
    stateManager.setMode(MODES.NORMAL);
    statusLine.setMessage('Normal mode');
  }
}

export const keyDispatcher = new KeyDispatcher();

