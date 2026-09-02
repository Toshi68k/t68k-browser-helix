/**
 * Helix In-Page Search Engine and Overlay (/ and ?)
 */

import { getShadowContainer } from './shadow-root.js';
import { statusLine } from './statusline.js';

export class SearchBar {
  constructor() {
    this.element = null;
    this.inputEl = null;
    this.countEl = null;
    this.isOpen = false;
    this.direction = 'forward'; // 'forward' | 'backward'
    this.lastQuery = '';
    this.matchCount = 0;
    this.currentIndex = 0;
    this.onClose = null;
  }

  open(direction = 'forward', onClose = null) {
    this.close();
    this.direction = direction;
    this.onClose = onClose;

    const container = getShadowContainer();
    if (!container) return;

    this.element = document.createElement('div');
    this.element.className = 'hx-search-bar';

    this.element.innerHTML = `
      <span class="hx-search-icon">${direction === 'forward' ? '/' : '?'}</span>
      <input type="text" class="hx-search-input" placeholder="Search page text..." spellcheck="false" />
      <span class="hx-search-count"></span>
    `;

    this.inputEl = this.element.querySelector('.hx-search-input');
    this.countEl = this.element.querySelector('.hx-search-count');

    // Input listeners
    this.inputEl.addEventListener('input', () => {
      const query = this.inputEl.value;
      this.executeLiveSearch(query);
    });

    this.inputEl.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.inputEl.value.trim();
        if (query) {
          this.lastQuery = query;
          if (this.direction === 'backward' || e.shiftKey) {
            this.findPrevious();
          } else {
            this.findNext();
          }
        }
        this.close();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });

    container.appendChild(this.element);
    this.isOpen = true;
    if (this.inputEl) this.inputEl.focus();
    setTimeout(() => {
      if (this.inputEl) this.inputEl.focus();
    }, 20);
  }

  executeLiveSearch(query) {
    if (!query || !query.trim()) {
      this.countEl.textContent = '';
      return;
    }

    // Count matches in page without modifying selection or stealing focus
    const text = document.body ? (document.body.innerText || document.body.textContent || '') : '';
    try {
      const regex = new RegExp(this.escapeRegExp(query.trim()), 'gi');
      const matches = text.match(regex);
      this.matchCount = matches ? matches.length : 0;
      this.countEl.textContent = this.matchCount > 0 ? `${this.matchCount} matches` : '0 matches';
    } catch (e) {
      this.countEl.textContent = 'Invalid query';
    }
  }

  findNext() {
    if (!this.lastQuery) return;
    if (window.find) {
      const found = window.find(this.lastQuery, false, false, true, false, false, false);
      if (!found) {
        // Wrap around
        window.scrollTo(0, 0);
        window.find(this.lastQuery, false, false, true, false, false, false);
      }
      statusLine.setMessage(`Search: "${this.lastQuery}"`);
    }
  }

  findPrevious() {
    if (!this.lastQuery) return;
    if (window.find) {
      const found = window.find(this.lastQuery, false, true, true, false, false, false);
      if (!found) {
        // Wrap around
        window.scrollTo(0, document.body.scrollHeight);
        window.find(this.lastQuery, false, true, true, false, false, false);
      }
      statusLine.setMessage(`Search: "${this.lastQuery}" (prev)`);
    }
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  close() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.inputEl = null;
    this.countEl = null;
    this.isOpen = false;
    if (this.onClose) {
      const cb = this.onClose;
      this.onClose = null;
      cb();
    }
  }
}

export const searchBar = new SearchBar();
