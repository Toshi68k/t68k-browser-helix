/**
 * Helix Which-Key Popup Guide
 * Displays available keyboard chords and actions dynamically.
 */

import { getShadowContainer } from './shadow-root.js';

export const MENUS = {
  space: {
    title: 'SPACE MENU',
    items: [
      { key: 'b', label: 'Buffer / Tab picker' },
      { key: 'f', label: 'Search bookmarks' },
      { key: 'h', label: 'Search history' },
      { key: 'z', label: 'Zen / Reader mode' },
      { key: 'y', label: 'Yank URL' },
      { key: 't', label: 'Yank title' },
      { key: 'w', label: 'Close tab' },
      { key: 'p', label: 'Toggle pin tab' },
      { key: 'm', label: 'Toggle mute tab' },
      { key: 's', label: 'Split window' },
      { key: 'u', label: 'Restore closed tab' },
      { key: 'n', label: 'New tab' },
      { key: 'd', label: 'Duplicate tab' },
      { key: 'o', label: 'Options / Settings' }
    ]
  },
  goto: {
    title: 'GOTO (g)',
    items: [
      { key: 'w', label: 'Jump / Link hint' },
      { key: 'W', label: 'Jump in new tab' },
      { key: 'g', label: 'Top of page' },
      { key: 'e', label: 'Bottom of page' },
      { key: 't', label: 'Window top' },
      { key: 'c', label: 'Window center' },
      { key: 'b', label: 'Window bottom' },
      { key: 'n', label: 'Next tab / buffer' },
      { key: 'p', label: 'Previous tab / buffer' },
      { key: 'a', label: 'Alternate / Prev tab' },
      { key: 'h', label: 'Line start / far left' },
      { key: 'l', label: 'Line end / far right' },
      { key: '<', label: 'History back' },
      { key: '>', label: 'History forward' },
      { key: 'i', label: 'First input field' },
      { key: 'u', label: 'Go up URL hierarchy' },
      { key: 's', label: 'View page source' },
      { key: 'r', label: 'Reload page' },
      { key: 'R', label: 'Hard reload' }
    ]
  },
  bracket_next: {
    title: 'JUMP NEXT (])',
    items: [
      { key: 'c', label: 'Next code block' },
      { key: 'h', label: 'Next heading' },
      { key: 'l', label: 'Next link' },
      { key: 'i', label: 'Next input / form' },
      { key: 'b', label: 'Next button' },
      { key: 'p', label: 'Next paragraph' },
      { key: 't', label: 'Next tab' }
    ]
  },
  bracket_prev: {
    title: 'JUMP PREVIOUS ([)',
    items: [
      { key: 'c', label: 'Previous code block' },
      { key: 'h', label: 'Previous heading' },
      { key: 'l', label: 'Previous link' },
      { key: 'i', label: 'Previous input / form' },
      { key: 'b', label: 'Previous button' },
      { key: 'p', label: 'Previous paragraph' },
      { key: 't', label: 'Previous tab' }
    ]
  },
  yank: {
    title: 'YANK (y)',
    items: [
      { key: 'c', label: 'Yank code snippet' },
      { key: 'm', label: 'Yank as Markdown' },
      { key: 'T', label: 'Yank table as TSV' },
      { key: 'g', label: 'Yank Git clone URL' },
      { key: 'l', label: 'Yank Markdown link' },
      { key: 'y', label: 'Yank URL' },
      { key: 't', label: 'Yank page title' },
      { key: 'f', label: 'Yank link target (hint)' },
      { key: 's', label: 'Yank selection' }
    ]
  },
  zoom: {
    title: 'VIEW / ZOOM (z)',
    items: [
      { key: 'z', label: 'Center view (zz)' },
      { key: 't', label: 'Align top (zt)' },
      { key: 'b', label: 'Align bottom (zb)' },
      { key: 'i', label: 'Zoom in' },
      { key: 'o', label: 'Zoom out' },
      { key: '0', label: 'Zoom reset' }
    ]
  }
};

export class WhichKey {
  constructor() {
    this.element = null;
    this.isOpen = false;
  }

  show(menuKey, onSelect = null) {
    this.hide();
    const menu = MENUS[menuKey];
    if (!menu) return;

    const container = getShadowContainer();
    if (!container) return;

    this.element = document.createElement('div');
    this.element.className = 'hx-which-key';

    const itemsHtml = menu.items.map(item => `
      <div class="hx-which-key-item" data-key="${item.key}">
        <span class="hx-key-badge">${item.key}</span>
        <span class="hx-key-label">${item.label}</span>
      </div>
    `).join('');

    this.element.innerHTML = `
      <div class="hx-which-key-title">
        <span>${menu.title}</span>
        <span style="font-size: 9px; opacity: 0.7;">Esc to cancel</span>
      </div>
      <div class="hx-which-key-grid">
        ${itemsHtml}
      </div>
    `;

    // Click handler for mouse interaction
    this.element.querySelectorAll('.hx-which-key-item').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.getAttribute('data-key');
        if (onSelect) onSelect(key);
        this.hide();
      });
    });

    container.appendChild(this.element);
    this.isOpen = true;
  }

  hide() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.isOpen = false;
  }
}

export const whichKey = new WhichKey();
