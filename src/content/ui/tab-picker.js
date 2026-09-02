/**
 * Helix Buffer / Tab / Bookmark / History Fuzzy Picker (<Space>b, <Space>f, <Space>h)
 */

import { getShadowContainer } from './shadow-root.js';

export class TabPicker {
  constructor() {
    this.element = null;
    this.searchEl = null;
    this.listEl = null;
    this.isOpen = false;
    this.items = [];
    this.filtered = [];
    this.selectedIndex = 0;
    this.mode = 'tabs'; // 'tabs' | 'bookmarks' | 'history'
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

    const titlePlaceholder = mode === 'tabs' ? 'Switch buffer / tab...' : (mode === 'bookmarks' ? 'Search bookmarks...' : 'Search history...');

    this.element.innerHTML = `
      <div class="hx-tab-picker-modal">
        <div class="hx-tab-picker-header">
          <span style="color: var(--hx-accent); font-weight: 700;">󰕘</span>
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
    }

    this.filterItems();
  }

  filterItems() {
    const query = this.searchEl.value.toLowerCase().trim();
    if (!query) {
      this.filtered = [...this.items];
    } else {
      this.filtered = this.items.filter(item => {
        return item.title.toLowerCase().includes(query) || item.url.toLowerCase().includes(query);
      });
    }

    this.selectedIndex = 0;
    this.renderList();
  }

  renderList() {
    if (this.filtered.length === 0) {
      this.listEl.innerHTML = `<div style="padding: 12px; color: var(--hx-text-muted); text-align: center;">No matching items</div>`;
      return;
    }

    this.listEl.innerHTML = this.filtered.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;
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
