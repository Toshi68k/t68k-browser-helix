/**
 * Helix Link and Element Hinting System
 * Renders optimal 2-letter keyboard hints on clickable DOM elements.
 */

import { getShadowContainer } from './shadow-root.js';

export class HintManager {
  constructor() {
    this.activeHints = [];
    this.currentInput = '';
    this.hintCharacters = 'fjdkslaeiruvncmghwoqptyzb';
    this.mode = 'click'; // 'click' | 'newTab' | 'yank'
    this.onComplete = null;
  }

  setHintCharacters(chars) {
    if (chars && chars.length >= 2) {
      this.hintCharacters = chars;
    }
  }

  getClickableElements() {
    const selector = [
      'a[href]',
      'button',
      'input:not([type="hidden"])',
      'textarea',
      'select',
      '[role="button"]',
      '[role="link"]',
      '[role="checkbox"]',
      '[role="menuitem"]',
      '[role="tab"]',
      '[onclick]',
      'summary',
      'video',
      'audio',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const all = Array.from(document.querySelectorAll(selector));
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return all.filter(el => {
      if (el.closest('#helix-chrome-root')) return false;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      
      const isInViewport = (
        rect.top < viewportHeight &&
        rect.bottom > 0 &&
        rect.left < viewportWidth &&
        rect.right > 0
      );

      return (
        isInViewport &&
        rect.width > 2 &&
        rect.height > 2 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        parseFloat(style.opacity || '1') > 0.05
      );
    });
  }

  generateHintStrings(count) {
    const chars = this.hintCharacters;
    const base = chars.length;
    const hints = [];

    if (count <= base) {
      for (let i = 0; i < count; i++) {
        hints.push(chars[i]);
      }
      return hints;
    }

    // 2-character hint combinations
    const length = 2;
    for (let i = 0; i < base && hints.length < count; i++) {
      for (let j = 0; j < base && hints.length < count; j++) {
        hints.push(chars[i] + chars[j]);
      }
    }
    return hints;
  }

  start(mode = 'click', onComplete = null) {
    this.clear();
    this.mode = mode;
    this.onComplete = onComplete;
    this.currentInput = '';

    const elements = this.getClickableElements();
    if (elements.length === 0) {
      if (this.onComplete) this.onComplete(null);
      return;
    }

    const hintStrings = this.generateHintStrings(elements.length);
    const container = getShadowContainer();
    if (!container) return;

    elements.forEach((el, index) => {
      const hintStr = hintStrings[index];
      const rect = el.getBoundingClientRect();

      const marker = document.createElement('div');
      marker.className = 'hx-hint-marker';
      marker.textContent = hintStr.toUpperCase();
      
      // Position relative to viewport
      marker.style.top = `${Math.max(0, rect.top + window.scrollY)}px`;
      marker.style.left = `${Math.max(0, rect.left + window.scrollX)}px`;

      container.appendChild(marker);

      this.activeHints.push({
        element: el,
        hintStr: hintStr.toLowerCase(),
        markerNode: marker
      });
    });
  }

  handleKey(key) {
    const char = key.toLowerCase();
    this.currentInput += char;

    const matched = this.activeHints.filter(h => h.hintStr.startsWith(this.currentInput));

    if (matched.length === 1 && matched[0].hintStr === this.currentInput) {
      // Exact match
      this.executeTarget(matched[0].element);
      this.clear();
      if (this.onComplete) this.onComplete(matched[0]);
      return true;
    } else if (matched.length > 0) {
      // Partial match: update marker text rendering
      this.activeHints.forEach(h => {
        if (h.hintStr.startsWith(this.currentInput)) {
          h.markerNode.style.display = 'block';
          const matchedPart = h.hintStr.substring(0, this.currentInput.length).toUpperCase();
          const restPart = h.hintStr.substring(this.currentInput.length).toUpperCase();
          h.markerNode.innerHTML = `<span class="matched">${matchedPart}</span>${restPart}`;
        } else {
          h.markerNode.style.display = 'none';
        }
      });
      return true;
    } else {
      // No match
      this.clear();
      if (this.onComplete) this.onComplete(null);
      return false;
    }
  }

  executeTarget(element) {
    if (this.mode === 'yank') {
      const targetUrl = element.href || element.src || element.getAttribute('data-url') || element.textContent.trim();
      if (targetUrl) {
        navigator.clipboard.writeText(targetUrl);
      }
      return;
    }

    if (this.mode === 'newTab') {
      const url = element.href;
      if (url) {
        chrome.runtime.sendMessage({ type: 'NEW_TAB', url, active: false });
      } else {
        element.click();
      }
      return;
    }

    // Default 'click'
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable) {
      element.focus();
    } else {
      element.click();
    }
  }

  clear() {
    this.activeHints.forEach(h => {
      if (h.markerNode && h.markerNode.parentNode) {
        h.markerNode.parentNode.removeChild(h.markerNode);
      }
    });
    this.activeHints = [];
    this.currentInput = '';
  }
}

export const hintManager = new HintManager();
