/**
 * Helix Command Bar and Prompt System (:)
 */

import { getShadowContainer, setTheme } from './shadow-root.js';
import { statusLine } from './statusline.js';
import { readerMode } from './reader.js';
import { CliUtils } from '../navigation/cli-utils.js';

const AVAILABLE_COMMANDS = [
  { name: 'open', desc: 'Open URL, search, or bang (!gh, !so, !yt, !npm)', usage: ':open <url|!bang query>' },
  { name: 'o', desc: 'Alias for open', usage: ':o <url|query>' },
  { name: 'tabnew', desc: 'Open URL or new empty tab', usage: ':tabnew [url]' },
  { name: 't', desc: 'Alias for tabnew', usage: ':t [url]' },
  { name: 'buffer', desc: 'Switch to tab/buffer (:b <index|query|#>)', usage: ':b [index|query|#]' },
  { name: 'b', desc: 'Alias for buffer', usage: ':b [index|query|#]' },
  { name: 'close', desc: 'Close current tab', usage: ':close' },
  { name: 'q', desc: 'Alias for close tab', usage: ':q' },
  { name: 'only', desc: 'Close all other tabs in window', usage: ':only' },
  { name: 'pin', desc: 'Toggle tab pinned status', usage: ':pin' },
  { name: 'mute', desc: 'Toggle tab audio mute status', usage: ':mute' },
  { name: 'split', desc: 'Split browser into dual tiled windows', usage: ':split' },
  { name: 'vsplit', desc: 'Alias for split window', usage: ':vsplit' },
  { name: 'zen', desc: 'Toggle minimalist reader mode', usage: ':zen' },
  { name: 'reader', desc: 'Alias for zen reader mode', usage: ':reader' },
  { name: 'curl', desc: 'Yank curl command for current URL', usage: ':curl' },
  { name: 'markdown', desc: 'Yank selection or page as clean Markdown', usage: ':markdown' },
  { name: 'table', desc: 'Yank nearest HTML table as TSV', usage: ':table' },
  { name: 'git', desc: 'Yank Git clone URL (GitHub/GitLab)', usage: ':git' },
  { name: 'reload', desc: 'Reload current page', usage: ':reload' },
  { name: 'r', desc: 'Alias for reload', usage: ':r' },
  { name: 'hardreload', desc: 'Reload ignoring cache', usage: ':hardreload' },
  { name: 'theme', desc: 'Change UI color theme', usage: ':theme <name>' },
  { name: 'settings', desc: 'Open Helix extension options', usage: ':settings' },
  { name: 'options', desc: 'Alias for settings', usage: ':options' },
  { name: 'duplicate', desc: 'Duplicate current tab', usage: ':duplicate' },
  { name: 'help', desc: 'Show keybindings and command help', usage: ':help' }
];

const SEARCH_BANGS = {
  '!gh': (q) => `https://github.com/search?q=${encodeURIComponent(q)}`,
  '!so': (q) => `https://stackoverflow.com/search?q=${encodeURIComponent(q)}`,
  '!yt': (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  '!w': (q) => `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`,
  '!npm': (q) => `https://www.npmjs.com/search?q=${encodeURIComponent(q)}`,
  '!crates': (q) => `https://crates.io/search?q=${encodeURIComponent(q)}`,
  '!mdn': (q) => `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(q)}`,
  '!g': (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  '!ddg': (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  '!kagi': (q) => `https://kagi.com/search?q=${encodeURIComponent(q)}`
};

const THEMES = ['helix_dark', 'catppuccin_mocha'];

export class CommandBar {
  constructor() {
    this.element = null;
    this.inputEl = null;
    this.completionsEl = null;
    this.isOpen = false;
    this.history = [];
    this.historyIndex = -1;
    this.activeCompletionIdx = -1;
    this.currentMatches = [];
    this.onClose = null;
  }

  open(initialValue = '', onClose = null) {
    this.close();
    this.onClose = onClose;

    const container = getShadowContainer();
    if (!container) return;

    this.element = document.createElement('div');
    this.element.className = 'hx-command-bar';

    this.element.innerHTML = `
      <div class="hx-command-input-wrapper">
        <span class="hx-command-prompt-symbol">:</span>
        <input type="text" class="hx-command-input" placeholder="Type a command (e.g. open !gh ..., zen, pin, only, b, split)..." spellcheck="false" />
      </div>
      <div class="hx-command-completions" style="display: none;"></div>
    `;

    this.inputEl = this.element.querySelector('.hx-command-input');
    this.completionsEl = this.element.querySelector('.hx-command-completions');

    if (initialValue) {
      this.inputEl.value = initialValue;
    }

    this.inputEl.addEventListener('input', () => this.handleInput());
    this.inputEl.addEventListener('keydown', (e) => this.handleKeyDown(e));

    container.appendChild(this.element);
    this.isOpen = true;
    this.historyIndex = -1;
    this.activeCompletionIdx = -1;

    if (this.inputEl) {
      this.inputEl.focus();
      this.handleInput();
    }
    setTimeout(() => {
      if (this.inputEl) {
        this.inputEl.focus();
        this.handleInput();
      }
    }, 20);
  }

  handleInput() {
    const val = this.inputEl.value.trim();
    const parts = val.split(' ');
    const cmd = parts[0].toLowerCase();

    if (cmd === 'theme' && parts.length > 1) {
      // Suggest themes
      const themePrefix = parts[1].toLowerCase();
      this.currentMatches = THEMES
        .filter(t => t.startsWith(themePrefix))
        .map(t => ({ name: `theme ${t}`, desc: `Switch to ${t} theme` }));
    } else {
      this.currentMatches = AVAILABLE_COMMANDS.filter(c => c.name.startsWith(cmd));
    }

    this.renderCompletions();
  }

  renderCompletions() {
    if (this.currentMatches.length === 0 || !this.inputEl.value.trim()) {
      this.completionsEl.style.display = 'none';
      return;
    }

    this.completionsEl.style.display = 'flex';
    this.completionsEl.innerHTML = this.currentMatches.map((m, idx) => `
      <div class="hx-command-completion-item ${idx === this.activeCompletionIdx ? 'active' : ''}" data-idx="${idx}">
        <strong>${m.name}</strong> <span style="opacity:0.7">— ${m.desc}</span>
      </div>
    `).join('');

    this.completionsEl.querySelectorAll('.hx-command-completion-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        this.selectCompletion(idx);
      });
    });
  }

  selectCompletion(idx) {
    if (idx >= 0 && idx < this.currentMatches.length) {
      this.inputEl.value = this.currentMatches[idx].name + ' ';
      this.inputEl.focus();
      this.handleInput();
    }
  }

  handleKeyDown(e) {
    e.stopPropagation();

    if (e.key === 'Tab') {
      e.preventDefault();
      if (this.currentMatches.length > 0) {
        this.activeCompletionIdx = (this.activeCompletionIdx + 1) % this.currentMatches.length;
        this.selectCompletion(this.activeCompletionIdx);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0) {
        if (this.historyIndex === -1) this.historyIndex = this.history.length - 1;
        else if (this.historyIndex > 0) this.historyIndex--;
        this.inputEl.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex !== -1) {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = -1;
          this.inputEl.value = '';
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const raw = this.inputEl.value.trim();
      if (raw) {
        this.history.push(raw);
        this.execute(raw);
      }
      this.close();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  resolveUrlOrQuery(input) {
    const trimmed = input.trim();
    // Check for bang search (e.g. !gh query, !so query)
    const bangMatch = trimmed.match(/^(![a-zA-Z0-9]+)\s+(.+)$/);
    if (bangMatch) {
      const bang = bangMatch[1].toLowerCase();
      const query = bangMatch[2];
      if (SEARCH_BANGS[bang]) {
        return SEARCH_BANGS[bang](query);
      }
    }

    if (trimmed.includes('.') && !trimmed.includes(' ')) {
      return trimmed.includes('://') ? trimmed : `https://${trimmed}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  }

  async execute(commandStr) {
    const parts = commandStr.split(' ').filter(Boolean);
    if (parts.length === 0) return;

    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'open':
      case 'o': {
        if (!args) return;
        const url = this.resolveUrlOrQuery(args);
        window.location.href = url;
        break;
      }

      case 'tabnew':
      case 't': {
        const url = args ? this.resolveUrlOrQuery(args) : undefined;
        chrome.runtime.sendMessage({ type: 'NEW_TAB', url, active: true });
        break;
      }

      case 'close':
      case 'q': {
        chrome.runtime.sendMessage({ type: 'CLOSE_TAB' });
        break;
      }

      case 'only': {
        chrome.runtime.sendMessage({ type: 'CLOSE_OTHER_TABS' });
        statusLine.setMessage('Closed other tabs');
        break;
      }

      case 'pin': {
        const res = await chrome.runtime.sendMessage({ type: 'TOGGLE_PIN_TAB' });
        statusLine.setMessage(res?.pinned ? 'Tab pinned' : 'Tab unpinned');
        break;
      }

      case 'mute': {
        const res = await chrome.runtime.sendMessage({ type: 'TOGGLE_MUTE_TAB' });
        statusLine.setMessage(res?.muted ? 'Tab muted' : 'Tab unmuted');
        break;
      }

      case 'split':
      case 'vsplit': {
        chrome.runtime.sendMessage({ type: 'SPLIT_WINDOW' });
        statusLine.setMessage('Tiled window split');
        break;
      }

      case 'zen':
      case 'reader': {
        readerMode.toggle();
        break;
      }

      case 'curl': {
        CliUtils.yankCurlCommand();
        break;
      }

      case 'markdown':
      case 'md': {
        CliUtils.yankMarkdown();
        break;
      }

      case 'table': {
        CliUtils.yankTable();
        break;
      }

      case 'git': {
        CliUtils.yankGitUrl();
        break;
      }

      case 'reload':
      case 'r': {
        window.location.reload();
        break;
      }

      case 'hardreload': {
        window.location.reload(true);
        break;
      }

      case 'theme': {
        const themeName = parts[1];
        if (THEMES.includes(themeName)) {
          setTheme(themeName);
          await chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', settings: { theme: themeName } });
          statusLine.setMessage(`Theme changed to ${themeName}`);
        } else {
          statusLine.setMessage(`Available themes: ${THEMES.join(', ')}`, 5000);
        }
        break;
      }

      case 'b':
      case 'buffer': {
        if (args === '#' || args === 'alternate' || args === 'alt') {
          chrome.runtime.sendMessage({ type: 'SWITCH_ALTERNATE_TAB' });
          return;
        }
        if (args) {
          const res = await chrome.runtime.sendMessage({ type: 'GET_TABS', currentWindow: true });
          const tabs = res.tabs || [];
          const tabIdx = parseInt(args, 10);
          if (!isNaN(tabIdx) && tabIdx >= 1 && tabIdx <= tabs.length) {
            chrome.runtime.sendMessage({ type: 'SWITCH_TAB', tabId: tabs[tabIdx - 1].id });
          } else {
            const match = tabs.find(t => t.title.toLowerCase().includes(args.toLowerCase()) || t.url.toLowerCase().includes(args.toLowerCase()));
            if (match) {
              chrome.runtime.sendMessage({ type: 'SWITCH_TAB', tabId: match.id });
            } else {
              statusLine.setMessage(`Buffer not found: ${args}`);
            }
          }
        }
        break;
      }

      case 'duplicate': {
        chrome.runtime.sendMessage({ type: 'DUPLICATE_TAB' });
        break;
      }

      case 'settings':
      case 'options': {
        chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
        break;
      }

      case 'help': {
        statusLine.setMessage('Press Space for Menu, g for Goto, [ or ] for Jumps, f for Hints, / to Search', 6000);
        break;
      }

      default:
        statusLine.setMessage(`Unknown command: :${cmd}. Type :help for list.`, 4000);
    }
  }

  close() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.isOpen = false;
    if (this.onClose) this.onClose();
  }
}

export const commandBar = new CommandBar();

