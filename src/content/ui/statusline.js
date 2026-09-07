/**
 * Helix Bottom Status Line Component
 */

import { getShadowContainer } from './shadow-root.js';
import { scroller } from '../navigation/scroller.js';

export class StatusLine {
  constructor() {
    this.element = null;
    this.modeEl = null;
    this.messageEl = null;
    this.keysEl = null;
    this.scrollEl = null;
    this.titleEl = null;
    this.messageTimeout = null;
    this.currentModeCode = 'NORMAL';
    this.currentModeLabel = 'NOR';
  }

  mount(initialMode = null, initialLabel = null) {
    const container = getShadowContainer();
    if (!container || this.element) return;

    if (initialMode) {
      this.currentModeCode = initialMode;
      this.currentModeLabel = initialLabel || initialMode.toUpperCase();
    }

    this.element = document.createElement('div');
    this.element.className = 'hx-statusline';

    const modeClass = (this.currentModeCode || 'normal').toLowerCase();
    const modeText = this.currentModeLabel || 'NOR';

    this.element.innerHTML = `
      <div class="hx-status-left">
        <span class="hx-mode-badge mode-${modeClass}">${modeText}</span>
        <span class="hx-status-message"></span>
      </div>
      <div class="hx-status-right">
        <span class="hx-status-keys" style="display: none;"></span>
        <span class="hx-status-scroll">Top</span>
        <span class="hx-status-title"></span>
      </div>
    `;

    this.modeEl = this.element.querySelector('.hx-mode-badge');
    this.messageEl = this.element.querySelector('.hx-status-message');
    this.keysEl = this.element.querySelector('.hx-status-keys');
    this.scrollEl = this.element.querySelector('.hx-status-scroll');
    this.titleEl = this.element.querySelector('.hx-status-title');

    this.setMode(this.currentModeCode, this.currentModeLabel);
    this.updateTitle();
    this.updateScroll();

    container.appendChild(this.element);

    // Update scroll percentage on scroll
    window.addEventListener('scroll', () => this.updateScroll(), { passive: true });
  }

  setMode(modeCode, modeLabel) {
    this.currentModeCode = modeCode;
    this.currentModeLabel = modeLabel || modeCode.toUpperCase();
    if (!this.modeEl) return;
    this.modeEl.className = `hx-mode-badge mode-${modeCode.toLowerCase()}`;
    this.modeEl.textContent = this.currentModeLabel;
  }

  setMessage(text, durationMs = 3000) {
    if (!this.messageEl) return;
    this.messageEl.textContent = text;
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    if (durationMs > 0) {
      this.messageTimeout = setTimeout(() => {
        if (this.messageEl) this.messageEl.textContent = '';
      }, durationMs);
    }
  }

  setKeys(keyBuffer) {
    if (!this.keysEl) return;
    if (keyBuffer && keyBuffer.length > 0) {
      this.keysEl.textContent = keyBuffer;
      this.keysEl.style.display = 'inline-block';
    } else {
      this.keysEl.style.display = 'none';
      this.keysEl.textContent = '';
    }
  }

  updateScroll() {
    if (!this.scrollEl) return;
    this.scrollEl.textContent = scroller.getScrollPercentage();
  }

  updateTitle() {
    if (!this.titleEl) return;
    this.titleEl.textContent = document.title || window.location.hostname;
  }

  toggle(visible) {
    if (!this.element) return;
    if (visible) {
      this.element.classList.remove('hidden');
    } else {
      this.element.classList.add('hidden');
    }
  }
}

export const statusLine = new StatusLine();
