/**
 * Helix Buffer / Tab / Bookmark / History / Symbol Fuzzy Picker (<Space>b, <Space>f, <Space>h, <Space>s, <Space>o)
 */

import { getShadowContainer } from './shadow-root.js';
import { jumpList } from '../navigation/jump-list.js';
import { Traversal } from '../navigation/traversal.js';

export class TabPicker {
  constructor() {
    this.element = null;
    this.searchEl = null;
    this.listEl = null;
    this.isOpen = false;
    this.items = [];
    this.filtered = [];
    this.selectedIndex = 0;
    this.mode = 'tabs'; // 'tabs' | 'bookmarks' | 'history' | 'symbols'
    this.onClose = null;
  }

  async open(mode = 'tabs', onClose = null) {
    this.close();
    this.mode = mode;
    this.onClose = onClose;

    const container = getShadowContainer();
    if (!container) return;

    this.element = document.createElement('div');
    this.element.className = 'hx-tab-picker-overlay';

    let icon = '󰕘';
    let titlePlaceholder = 'Switch buffer / tab...';
    if (mode === 'bookmarks') {
      icon = '★';
      titlePlaceholder = 'Search bookmarks...';
    } else if (mode === 'history') {
      icon = '󰋚';
      titlePlaceholder = 'Search history...';
    } else if (mode === 'symbols') {
      icon = '§';
      titlePlaceholder = 'Jump to heading / symbol...';
    }

    this.element.innerHTML = `
      <div class="hx-tab-picker-modal">
        <div class="hx-tab-picker-header">
          <span style="color: var(--hx-accent); font-weight: 700; font-family: monospace, sans-serif; font-size: 15px;">${icon}</span>
          <input type="text" class="hx-tab-picker-search" placeholder="${titlePlaceholder}" spellcheck="false" />
        </div>
        <div class="hx-tab-picker-list"></div>
      </div>
    `;

    this.searchEl = this.element.querySelector('.hx-tab-picker-search');
    this.listEl = this.element.querySelector('.hx-tab-picker-list');

    this.searchEl.addEventListener('input', () => this.filterItems());
    this.searchEl.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Click outside to close
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) this.close();
    });

    container.appendChild(this.element);
    this.isOpen = true;

    if (this.searchEl) this.searchEl.focus();
    setTimeout(() => {
      if (this.searchEl) this.searchEl.focus();
    }, 20);

    await this.loadItems();
  }

  async loadItems() {
    if (this.mode === 'tabs') {
      const res = await chrome.runtime.sendMessage({ type: 'GET_TABS' });
      this.items = (res.tabs || []).map((t, idx) => ({
        id: t.id,
        windowId: t.windowId,
        title: t.title || 'Untitled',
        url: t.url || '',
        favIconUrl: t.favIconUrl || '',
        index: idx + 1,
        active: t.active
      }));
    } else if (this.mode === 'bookmarks') {
      const res = await chrome.runtime.sendMessage({ type: 'SEARCH_BOOKMARKS', query: '' });
      this.items = (res.results || []).filter(b => b.url).map((b, idx) => ({
        id: b.id,
        title: b.title || b.url,
        url: b.url,
        favIconUrl: '',
        index: idx + 1
      }));
    } else if (this.mode === 'history') {
      const res = await chrome.runtime.sendMessage({ type: 'SEARCH_HISTORY', query: '' });
      this.items = (res.results || []).map((h, idx) => ({
        id: h.id,
        title: h.title || h.url,
        url: h.url,
        favIconUrl: '',
        index: idx + 1
      }));
    } else if (this.mode === 'symbols') {
      const headingEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]'));
      const visibleHeadings = headingEls.filter(el => {
        if (el.closest('#helix-chrome-root')) return false;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          style.opacity !== '0'
        );
      });

      // Sort by vertical position on page
      visibleHeadings.sort((a, b) => {
        const topA = a.getBoundingClientRect().top + window.scrollY;
        const topB = b.getBoundingClientRect().top + window.scrollY;
        if (Math.abs(topA - topB) > 2) return topA - topB;
        return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
      });

      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 1);

      this.items = visibleHeadings.map((el, idx) => {
        const tag = el.tagName.toLowerCase();
        let level = 2;
        if (/^h[1-6]$/.test(tag)) {
          level = parseInt(tag[1], 10);
        } else if (el.hasAttribute('aria-level')) {
          level = parseInt(el.getAttribute('aria-level'), 10) || 2;
        }
        const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
        const top = el.getBoundingClientRect().top + window.scrollY;
        const pct = Math.min(100, Math.max(0, Math.round((top / docHeight) * 100)));

        return {
          id: `heading-${idx}`,
          element: el,
          level,
          title: text || `Heading ${level}`,
          percent: pct,
          index: idx + 1
        };
      }).filter(item => item.title && item.title.trim().length > 0);
    }

    this.filterItems();
  }

  filterItems() {
    const query = this.searchEl.value.toLowerCase().trim();
    if (!query) {
      this.filtered = [...this.items];
    } else {
      const tokens = query.split(/\s+/).filter(Boolean);
      this.filtered = this.items.filter(item => {
        const searchTarget = [
          item.title,
          item.url || '',
          item.level ? `h${item.level}` : ''
        ].join(' ').toLowerCase();
        return tokens.every(token => searchTarget.includes(token));
      });
    }

    this.selectedIndex = 0;
    this.renderList();
  }

  renderList() {
    if (this.filtered.length === 0) {
      const msg = (this.mode === 'symbols' && this.items.length === 0)
        ? 'No headings found on this page'
        : 'No matching items';
      this.listEl.innerHTML = `<div style="padding: 16px; color: var(--hx-text-muted); text-align: center; font-size: 13px;">${msg}</div>`;
      return;
    }

    this.listEl.innerHTML = this.filtered.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;

      if (this.mode === 'symbols') {
        const indent = Math.max(0, (item.level - 1) * 14);
        return `
          <div class="hx-tab-item hx-symbol-item ${isSelected ? 'selected' : ''}" data-idx="${idx}">
            <span class="hx-heading-badge hx-level-${item.level}">H${item.level}</span>
            <div class="hx-tab-info" style="padding-left: ${indent}px;">
              <span class="hx-tab-title">${this.escapeHtml(item.title)}</span>
            </div>
            <span class="hx-tab-index">${item.percent !== undefined ? `${item.percent}%` : item.index}</span>
          </div>
        `;
      }

      const favicon = item.favIconUrl
        ? `<img class="hx-tab-favicon" src="${item.favIconUrl}" alt="" onerror="this.style.display='none'" />`
        : `<span style="font-size: 14px; width: 16px; text-align:center;">📄</span>`;

      return `
        <div class="hx-tab-item ${isSelected ? 'selected' : ''}" data-idx="${idx}">
          ${favicon}
          <div class="hx-tab-info">
            <span class="hx-tab-title">${this.escapeHtml(item.title)}</span>
            <span class="hx-tab-url">${this.escapeHtml(item.url)}</span>
          </div>
          <span class="hx-tab-index">${item.index || ''}</span>
        </div>
      `;
    }).join('');

    // Click selection
    this.listEl.querySelectorAll('.hx-tab-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        this.selectItem(idx);
      });
    });

    this.scrollToSelected();
  }

  scrollToSelected() {
    const selectedEl = this.listEl.children[this.selectedIndex];
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  handleKeyDown(e) {
    e.stopPropagation();

    if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'j') || (e.ctrlKey && e.key === 'n')) {
      e.preventDefault();
      if (this.filtered.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.filtered.length;
        this.renderList();
      }
    } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'k') || (e.ctrlKey && e.key === 'p')) {
      e.preventDefault();
      if (this.filtered.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.filtered.length) % this.filtered.length;
        this.renderList();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.selectItem(this.selectedIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  async selectItem(idx) {
    const item = this.filtered[idx];
    if (!item) return;

    if (this.mode === 'symbols') {
      if (item.element) {
        if (typeof jumpList !== 'undefined' && jumpList.recordPosition) {
          jumpList.recordPosition();
        }
        item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof Traversal !== 'undefined' && Traversal.flashHighlight) {
          Traversal.flashHighlight(item.element);
        } else {
          this.flashHeading(item.element);
        }
      }
      this.close();
      return;
    }

    if (this.mode === 'tabs') {
      await chrome.runtime.sendMessage({
        type: 'SWITCH_TAB',
        tabId: item.id,
        windowId: item.windowId
      });
    } else {
      // Bookmarks or history: open in current or new tab
      window.location.href = item.url;
    }

    this.close();
  }

  flashHeading(element) {
    const originalOutline = element.style.outline;
    const originalTransition = element.style.transition;
    element.style.transition = 'outline 0.15s ease';
    element.style.outline = '3px solid #b4befe';
    setTimeout(() => {
      element.style.outline = originalOutline;
      element.style.transition = originalTransition;
    }, 600);
  }

  escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  close() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.isOpen = false;
    const cb = this.onClose;
    this.onClose = null;
    if (cb) cb();
  }
}

export const tabPicker = new TabPicker();
