/**
 * T68k Browser Helix - Bundled Standalone Content Script
 * Generated: 2026-09-07T14:10:03.724Z
 */
(function() {
'use strict';

const INLINED_HELIX_CSS = "/**\n * T68k Browser Helix - Core UI Stylesheet\n * Encapsulated completely inside Shadow DOM (#helix-chrome-root)\n */\n\n:host {\n  all: initial;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  z-index: 2147483647;\n  font-family: -apple-system, BlinkMacSystemFont, \"JetBrains Mono\", \"Fira Code\", \"SF Pro Display\", \"Segoe UI\", Roboto, monospace;\n  font-size: 13px;\n  line-height: 1.4;\n  box-sizing: border-box;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit;\n  margin: 0;\n  padding: 0;\n}\n\n/* ==================== THEME DEFINITIONS ==================== */\n\n.theme-helix_dark {\n  --hx-bg: #141423;\n  --hx-surface: #1e1e2e;\n  --hx-surface-elevated: #28283d;\n  --hx-border: #3b3b58;\n  --hx-text: #dcd7ba;\n  --hx-text-muted: #7e7e9a;\n  --hx-accent: #b4befe;\n  --hx-accent-dim: #727169;\n  --hx-mode-nor-bg: #89b4fa;\n  --hx-mode-nor-fg: #11111b;\n  --hx-mode-ins-bg: #a6e3a1;\n  --hx-mode-ins-fg: #11111b;\n  --hx-mode-sel-bg: #cba6f7;\n  --hx-mode-sel-fg: #11111b;\n  --hx-mode-cmd-bg: #fab387;\n  --hx-mode-cmd-fg: #11111b;\n  --hx-mode-src-bg: #f9e2af;\n  --hx-mode-src-fg: #11111b;\n  --hx-hint-bg: #f9e2af;\n  --hx-hint-fg: #11111b;\n  --hx-hint-border: #fab387;\n  --hx-highlight: rgba(180, 190, 254, 0.35);\n  --hx-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);\n}\n\n.theme-catppuccin_mocha {\n  --hx-bg: #1e1e2e;\n  --hx-surface: #181825;\n  --hx-surface-elevated: #313244;\n  --hx-border: #45475a;\n  --hx-text: #cdd6f4;\n  --hx-text-muted: #6c7086;\n  --hx-accent: #cba6f7;\n  --hx-accent-dim: #585b70;\n  --hx-mode-nor-bg: #89b4fa;\n  --hx-mode-nor-fg: #11111b;\n  --hx-mode-ins-bg: #a6e3a1;\n  --hx-mode-ins-fg: #11111b;\n  --hx-mode-sel-bg: #f5c2e7;\n  --hx-mode-sel-fg: #11111b;\n  --hx-mode-cmd-bg: #fab387;\n  --hx-mode-cmd-fg: #11111b;\n  --hx-mode-src-bg: #f9e2af;\n  --hx-mode-src-fg: #11111b;\n  --hx-hint-bg: #f9e2af;\n  --hx-hint-fg: #11111b;\n  --hx-hint-border: #fab387;\n  --hx-highlight: rgba(203, 166, 247, 0.35);\n  --hx-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);\n}\n\n\n/* ==================== HELIX STATUS LINE ==================== */\n\n.hx-statusline {\n  position: fixed;\n  bottom: 8px;\n  right: 12px;\n  height: 26px;\n  max-width: 480px;\n  width: auto;\n  background-color: var(--hx-surface);\n  color: var(--hx-text);\n  border: 1px solid var(--hx-border);\n  border-radius: 6px;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 0 8px;\n  font-family: inherit;\n  font-size: 11.5px;\n  font-weight: 500;\n  user-select: none;\n  pointer-events: none;\n  z-index: 10000;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  transition: transform 0.15s ease, opacity 0.15s ease;\n}\n\n.hx-statusline.hx-hud-dimmed {\n  opacity: 0.1;\n}\n\n.hx-statusline.hidden {\n  transform: translateY(150%);\n  opacity: 0;\n}\n\n.hx-mode-badge {\n  padding: 2px 8px;\n  font-weight: 700;\n  font-size: 10.5px;\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n  border-radius: 2px;\n  transition: background-color 0.12s ease, color 0.12s ease;\n}\n\n.hx-mode-badge.mode-nor {\n  background: var(--hx-mode-nor-bg);\n  color: var(--hx-mode-nor-fg);\n}\n\n.hx-mode-badge.mode-ins {\n  background: var(--hx-mode-ins-bg);\n  color: var(--hx-mode-ins-fg);\n}\n\n.hx-mode-badge.mode-sel {\n  background: var(--hx-mode-sel-bg);\n  color: var(--hx-mode-sel-fg);\n}\n\n.hx-mode-badge.mode-cmd {\n  background: var(--hx-mode-cmd-bg);\n  color: var(--hx-mode-cmd-fg);\n}\n\n.hx-mode-badge.mode-src {\n  background: var(--hx-mode-src-bg);\n  color: var(--hx-mode-src-fg);\n}\n\n.hx-mode-badge.mode-hnt {\n  background: var(--hx-hint-bg);\n  color: var(--hx-hint-fg);\n}\n\n.hx-mode-badge.mode-spc {\n  background: var(--hx-accent);\n  color: var(--hx-surface);\n}\n\n.hx-mode-badge.mode-gto {\n  background: var(--hx-accent);\n  color: var(--hx-surface);\n}\n\n.hx-mode-badge.mode-pck,\n.hx-mode-badge.mode-picker {\n  background: var(--hx-accent);\n  color: var(--hx-surface);\n}\n\n.hx-status-message {\n  color: var(--hx-text);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 450px;\n}\n\n.hx-status-keys {\n  background: var(--hx-surface-elevated);\n  color: var(--hx-accent);\n  padding: 1px 6px;\n  border-radius: 3px;\n  border: 1px solid var(--hx-border);\n  font-family: inherit;\n  font-size: 10.5px;\n  min-width: 24px;\n  text-align: center;\n}\n\n.hx-status-scroll {\n  color: var(--hx-text-muted);\n  font-variant-numeric: tabular-nums;\n}\n\n.hx-status-title {\n  color: var(--hx-text-muted);\n  max-width: 300px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* ==================== WHICH-KEY POPUP ==================== */\n\n.hx-which-key {\n  position: fixed;\n  bottom: 40px;\n  right: 12px;\n  background: var(--hx-bg);\n  border: 1px solid var(--hx-border);\n  border-radius: 6px;\n  box-shadow: var(--hx-shadow);\n  padding: 10px 14px;\n  color: var(--hx-text);\n  max-width: 420px;\n  min-width: 280px;\n  pointer-events: auto;\n  z-index: 10001;\n  animation: hx-fade-in 0.1s cubic-bezier(0.16, 1, 0.3, 1);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n}\n\n.hx-which-key-title {\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.8px;\n  color: var(--hx-accent);\n  margin-bottom: 8px;\n  padding-bottom: 4px;\n  border-bottom: 1px solid var(--hx-border);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.hx-which-key-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));\n  gap: 6px 12px;\n}\n\n.hx-which-key-item {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  cursor: pointer;\n  padding: 2px 4px;\n  border-radius: 4px;\n  transition: background-color 0.1s ease;\n}\n\n.hx-which-key-item:hover {\n  background: var(--hx-surface-elevated);\n}\n\n.hx-key-badge {\n  background: var(--hx-surface-elevated);\n  color: var(--hx-accent);\n  font-weight: 700;\n  padding: 1px 5px;\n  border-radius: 3px;\n  border: 1px solid var(--hx-border);\n  min-width: 18px;\n  text-align: center;\n  font-size: 11px;\n}\n\n.hx-key-label {\n  color: var(--hx-text);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/* ==================== LINK HINT OVERLAYS ==================== */\n\n.hx-hint-marker {\n  position: absolute;\n  z-index: 2147483640;\n  background-color: var(--hx-hint-bg);\n  color: var(--hx-hint-fg);\n  border: 1px solid var(--hx-hint-border);\n  font-family: inherit;\n  font-size: 11px;\n  font-weight: 800;\n  padding: 1px 4px;\n  border-radius: 3px;\n  line-height: 1.1;\n  text-transform: uppercase;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);\n  pointer-events: none;\n  opacity: 0.95;\n  transform: translateY(-2px);\n  animation: hx-pop-in 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n}\n\n.hx-hint-marker .matched {\n  color: #d20f39;\n  text-decoration: underline;\n  font-weight: 900;\n}\n\n/* ==================== COMMAND BAR & PROMPT ==================== */\n\n.hx-command-bar {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: var(--hx-bg);\n  border-top: 1px solid var(--hx-border);\n  box-shadow: var(--hx-shadow);\n  padding: 6px 12px;\n  display: flex;\n  flex-direction: column;\n  pointer-events: auto;\n  z-index: 10002;\n  animation: hx-slide-up 0.1s ease;\n}\n\n.hx-command-input-wrapper {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.hx-command-prompt-symbol {\n  color: var(--hx-mode-cmd-bg);\n  font-weight: 800;\n  font-size: 15px;\n}\n\n.hx-command-input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  outline: none;\n  color: var(--hx-text);\n  font-family: inherit;\n  font-size: 13px;\n  font-weight: 500;\n}\n\n.hx-command-completions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 6px;\n  padding-top: 6px;\n  border-top: 1px solid var(--hx-border);\n  max-height: 120px;\n  overflow-y: auto;\n}\n\n.hx-command-completion-item {\n  padding: 2px 8px;\n  background: var(--hx-surface);\n  color: var(--hx-text-muted);\n  border-radius: 3px;\n  font-size: 11px;\n  cursor: pointer;\n  border: 1px solid transparent;\n}\n\n.hx-command-completion-item.active {\n  background: var(--hx-surface-elevated);\n  color: var(--hx-accent);\n  border-color: var(--hx-accent);\n}\n\n/* ==================== SEARCH BAR ==================== */\n\n.hx-search-bar {\n  position: fixed;\n  bottom: 8px;\n  left: 12px;\n  background: var(--hx-bg);\n  border: 1px solid var(--hx-border);\n  border-radius: 6px;\n  box-shadow: var(--hx-shadow);\n  padding: 6px 12px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 320px;\n  max-width: 480px;\n  pointer-events: auto;\n  z-index: 10002;\n  animation: hx-fade-in 0.1s ease;\n}\n\n.hx-search-icon {\n  color: var(--hx-mode-src-bg);\n  font-weight: 800;\n}\n\n.hx-search-input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  outline: none;\n  color: var(--hx-text);\n  font-family: inherit;\n  font-size: 13px;\n}\n\n.hx-search-count {\n  font-size: 11px;\n  color: var(--hx-text-muted);\n  font-variant-numeric: tabular-nums;\n}\n\n/* ==================== TAB / BUFFER PICKER ==================== */\n\n.hx-tab-picker-overlay {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  padding-top: 10vh;\n  pointer-events: auto;\n  z-index: 10005;\n  backdrop-filter: blur(4px);\n  -webkit-backdrop-filter: blur(4px);\n}\n\n.hx-tab-picker-modal {\n  width: 580px;\n  max-width: 90vw;\n  background: var(--hx-bg);\n  border: 1px solid var(--hx-border);\n  border-radius: 8px;\n  box-shadow: var(--hx-shadow);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  animation: hx-scale-up 0.12s cubic-bezier(0.16, 1, 0.3, 1);\n}\n\n.hx-tab-picker-header {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 14px;\n  border-bottom: 1px solid var(--hx-border);\n  background: var(--hx-surface);\n}\n\n.hx-tab-picker-search {\n  flex: 1;\n  background: transparent;\n  border: none;\n  outline: none;\n  color: var(--hx-text);\n  font-family: inherit;\n  font-size: 14px;\n}\n\n.hx-tab-picker-list {\n  max-height: 380px;\n  overflow-y: auto;\n  padding: 6px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.hx-tab-item {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 6px 10px;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: background 0.1s ease;\n}\n\n.hx-tab-item:hover,\n.hx-tab-item.selected {\n  background: var(--hx-surface-elevated);\n}\n\n.hx-tab-item.selected {\n  border-left: 3px solid var(--hx-accent);\n}\n\n.hx-tab-favicon {\n  width: 16px;\n  height: 16px;\n  border-radius: 2px;\n  flex-shrink: 0;\n}\n\n.hx-tab-info {\n  flex: 1;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n\n.hx-tab-title {\n  color: var(--hx-text);\n  font-size: 12.5px;\n  font-weight: 500;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.hx-tab-url {\n  color: var(--hx-text-muted);\n  font-size: 10.5px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.hx-tab-index {\n  color: var(--hx-accent);\n  font-size: 11px;\n  font-weight: 700;\n  min-width: 20px;\n  text-align: right;\n}\n\n/* ==================== CARET / VISUAL SELECTION ==================== */\n\n.hx-visual-caret {\n  position: absolute;\n  width: 2px;\n  background-color: var(--hx-accent);\n  box-shadow: 0 0 6px var(--hx-accent);\n  pointer-events: none;\n  z-index: 2147483630;\n  animation: hx-blink 1s ease-in-out infinite;\n}\n\n/* ==================== ZEN / READER MODE ==================== */\n\n.hx-reader-overlay {\n  position: fixed;\n  inset: 0;\n  background: var(--hx-bg);\n  color: var(--hx-text);\n  overflow-y: auto;\n  padding: 40px 20px 80px 20px;\n  pointer-events: auto;\n  z-index: 2147483642;\n  display: flex;\n  justify-content: center;\n  animation: hx-fade-in 0.15s ease;\n}\n\n.hx-reader-container {\n  width: 760px;\n  max-width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n\n.hx-reader-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid var(--hx-border);\n  padding-bottom: 12px;\n}\n\n.hx-reader-tag {\n  background: var(--hx-surface-elevated);\n  color: var(--hx-accent);\n  font-weight: 700;\n  font-size: 11px;\n  letter-spacing: 1px;\n  padding: 3px 8px;\n  border-radius: 3px;\n  border: 1px solid var(--hx-border);\n}\n\n.hx-reader-close-btn {\n  background: var(--hx-surface);\n  color: var(--hx-text-muted);\n  border: 1px solid var(--hx-border);\n  padding: 4px 10px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-family: inherit;\n  font-size: 12px;\n  transition: all 0.1s ease;\n}\n\n.hx-reader-close-btn:hover {\n  background: var(--hx-surface-elevated);\n  color: var(--hx-text);\n}\n\n.hx-reader-title {\n  font-size: 26px;\n  font-weight: 800;\n  line-height: 1.3;\n  color: var(--hx-text);\n  margin-top: 10px;\n}\n\n.hx-reader-content {\n  font-size: 15px;\n  line-height: 1.7;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  color: var(--hx-text);\n}\n\n.hx-reader-content h2 {\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--hx-accent);\n  margin-top: 20px;\n  border-bottom: 1px solid var(--hx-border);\n  padding-bottom: 6px;\n}\n\n.hx-reader-content h3 {\n  font-size: 17px;\n  font-weight: 600;\n  color: var(--hx-text);\n  margin-top: 14px;\n}\n\n.hx-reader-content p {\n  color: var(--hx-text);\n}\n\n.hx-reader-content blockquote {\n  border-left: 3px solid var(--hx-accent);\n  padding-left: 14px;\n  color: var(--hx-text-muted);\n  font-style: italic;\n}\n\n.hx-reader-content li {\n  margin-left: 20px;\n}\n\n.hx-reader-code {\n  background: var(--hx-surface);\n  border: 1px solid var(--hx-border);\n  border-radius: 6px;\n  padding: 12px 14px;\n  overflow-x: auto;\n  font-family: inherit;\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--hx-text);\n}\n\n/* ==================== ANIMATIONS ==================== */\n\n@keyframes hx-fade-in {\n  from {\n    opacity: 0;\n    transform: translateY(4px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes hx-pop-in {\n  from {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n\n@keyframes hx-slide-up {\n  from {\n    transform: translateY(100%);\n  }\n\n  to {\n    transform: translateY(0);\n  }\n}\n\n@keyframes hx-scale-up {\n  from {\n    opacity: 0;\n    transform: scale(0.96) translateY(-8px);\n  }\n\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n\n@keyframes hx-blink {\n\n  0%,\n  100% {\n    opacity: 1;\n  }\n\n  50% {\n    opacity: 0.3;\n  }\n}";


/* ========== FILE: src/content/navigation/jump-list.js ========== */
/**
 * Helix-style Jump List Manager (Ctrl-o / Ctrl-i)
 * Tracks scroll and jump history across headings, search matches, and DOM jumps.
 */



class JumpList {
  constructor() {
    this.jumps = [];
    this.currentIndex = -1;
    this.maxJumps = 50;
    this.isNavigating = false;
  }

  recordPosition() {
    if (this.isNavigating) return;

    const currentPos = {
      x: window.scrollX,
      y: window.scrollY,
      url: window.location.href,
      time: Date.now()
    };

    // If we have a current jump, verify we actually moved far enough to count as a jump
    if (this.currentIndex >= 0 && this.currentIndex < this.jumps.length) {
      const prev = this.jumps[this.currentIndex];
      const distY = Math.abs(prev.y - currentPos.y);
      const distX = Math.abs(prev.x - currentPos.x);
      if (distY < 80 && distX < 80 && prev.url === currentPos.url) {
        return; // Don't push trivial position changes
      }
    }

    // Truncate any redo/forward entries if we jumped to a new place
    if (this.currentIndex < this.jumps.length - 1) {
      this.jumps = this.jumps.slice(0, this.currentIndex + 1);
    }

    this.jumps.push(currentPos);
    if (this.jumps.length > this.maxJumps) {
      this.jumps.shift();
    }
    this.currentIndex = this.jumps.length - 1;
  }

  jumpBack() {
    if (this.jumps.length === 0) {
      statusLine.setMessage('Jump list empty');
      return false;
    }

    // If we are at the end, record current position first so we can jump forward back to it
    if (this.currentIndex === this.jumps.length - 1) {
      this.recordPosition();
    }

    if (this.currentIndex > 0) {
      this.currentIndex--;
      const target = this.jumps[this.currentIndex];
      this.applyJump(target, `Jump backward (${this.currentIndex + 1}/${this.jumps.length})`);
      return true;
    } else {
      statusLine.setMessage('Oldest jump location reached');
      return false;
    }
  }

  jumpForward() {
    if (this.currentIndex < this.jumps.length - 1) {
      this.currentIndex++;
      const target = this.jumps[this.currentIndex];
      this.applyJump(target, `Jump forward (${this.currentIndex + 1}/${this.jumps.length})`);
      return true;
    } else {
      statusLine.setMessage('Newest jump location reached');
      return false;
    }
  }

  applyJump(target, message) {
    if (!target) return;
    this.isNavigating = true;
    if (target.url && target.url !== window.location.href && target.url.split('#')[0] === window.location.href.split('#')[0]) {
      window.location.href = target.url;
    }
    window.scrollTo({
      left: target.x,
      top: target.y,
      behavior: 'smooth'
    });
    if (message) {
      statusLine.setMessage(message);
    }
    setTimeout(() => {
      this.isNavigating = false;
    }, 400);
  }
}

const jumpList = new JumpList();


/* ========== FILE: src/content/navigation/cli-utils.js ========== */
/**
 * CLI and Helix Data Extraction & Yank Utilities
 */



class CliUtils {
  /**
   * Yank selection or whole article as clean Markdown
   */
  static async yankMarkdown() {
    const selection = window.getSelection();
    let markdown = '';

    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const container = document.createElement('div');
      for (let i = 0; i < selection.rangeCount; i++) {
        container.appendChild(selection.getRangeAt(i).cloneContents());
      }
      markdown = this.htmlToMarkdown(container);
    } else {
      // Find main article or body
      const mainEl = document.querySelector('article, main, [role="main"], .post-content, #content') || document.body;
      const clone = mainEl.cloneNode(true);
      // Remove scripts, styles, shadow roots, nav, footer
      clone.querySelectorAll('script, style, nav, footer, #helix-chrome-root, noscript, iframe').forEach(el => el.remove());
      markdown = `# ${document.title}\n\n` + this.htmlToMarkdown(clone);
    }

    if (markdown.trim()) {
      await navigator.clipboard.writeText(markdown.trim());
      statusLine.setMessage(`Yanked as Markdown (${markdown.length} chars)`);
      return true;
    } else {
      statusLine.setMessage('Could not extract Markdown');
      return false;
    }
  }

  /**
   * Convert an HTML subtree to readable Markdown text
   */
  static htmlToMarkdown(element) {
    let md = '';

    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        md += node.textContent.replace(/\s+/g, ' ');
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const tag = node.tagName.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        const level = parseInt(tag[1], 10);
        md += '\n\n' + '#'.repeat(level) + ' ';
        node.childNodes.forEach(walk);
        md += '\n\n';
        return;
      }

      if (tag === 'p') {
        md += '\n\n';
        node.childNodes.forEach(walk);
        md += '\n\n';
        return;
      }

      if (tag === 'pre' || tag === 'code') {
        if (tag === 'pre') {
          md += '\n\n```\n' + (node.textContent || '').trim() + '\n```\n\n';
        } else if (node.parentNode && node.parentNode.tagName.toLowerCase() !== 'pre') {
          md += ' `' + (node.textContent || '').trim() + '` ';
        }
        return;
      }

      if (tag === 'ul' || tag === 'ol') {
        md += '\n';
        let idx = 1;
        Array.from(node.children).forEach(li => {
          if (li.tagName.toLowerCase() === 'li') {
            md += tag === 'ul' ? '* ' : `${idx++}. `;
            li.childNodes.forEach(walk);
            md += '\n';
          }
        });
        md += '\n';
        return;
      }

      if (tag === 'a') {
        const href = node.getAttribute('href');
        const text = node.textContent.trim();
        if (href && text) {
          const fullUrl = href.startsWith('http') ? href : new URL(href, window.location.href).href;
          md += ` [${text}](${fullUrl}) `;
        } else {
          node.childNodes.forEach(walk);
        }
        return;
      }

      if (tag === 'blockquote') {
        md += '\n\n> ' + (node.textContent || '').trim().replace(/\n/g, '\n> ') + '\n\n';
        return;
      }

      if (tag === 'table') {
        md += '\n\n' + this.tableToMarkdown(node) + '\n\n';
        return;
      }

      if (tag === 'br') {
        md += '\n';
        return;
      }

      node.childNodes.forEach(walk);
    };

    walk(element);
    return md.replace(/\n{3,}/g, '\n\n');
  }

  /**
   * Convert an HTML Table to Markdown Table format
   */
  static tableToMarkdown(tableEl) {
    const rows = Array.from(tableEl.querySelectorAll('tr'));
    if (rows.length === 0) return '';

    const matrix = rows.map(r => Array.from(r.querySelectorAll('th, td')).map(c => c.textContent.trim().replace(/\|/g, '\\|').replace(/\s+/g, ' ')));
    if (matrix.length === 0 || matrix[0].length === 0) return '';

    let out = '| ' + matrix[0].join(' | ') + ' |\n';
    out += '| ' + matrix[0].map(() => '---').join(' | ') + ' |\n';

    for (let i = 1; i < matrix.length; i++) {
      out += '| ' + matrix[i].join(' | ') + ' |\n';
    }
    return out;
  }

  /**
   * Convert nearest table to TSV format (ideal for CLI pipes & spreadsheets)
   */
  static async yankTable() {
    const tables = Array.from(document.querySelectorAll('table')).filter(t => {
      const rect = t.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    if (tables.length === 0) {
      statusLine.setMessage('No HTML table found on page');
      return false;
    }

    // Pick table closest to center of viewport
    const viewCenterY = window.innerHeight / 2;
    tables.sort((a, b) => {
      const distA = Math.abs(a.getBoundingClientRect().top + a.getBoundingClientRect().height / 2 - viewCenterY);
      const distB = Math.abs(b.getBoundingClientRect().top + b.getBoundingClientRect().height / 2 - viewCenterY);
      return distA - distB;
    });

    const targetTable = tables[0];
    const rows = Array.from(targetTable.querySelectorAll('tr'));
    const tsv = rows.map(r => {
      return Array.from(r.querySelectorAll('th, td')).map(c => c.textContent.trim().replace(/\t/g, ' ').replace(/\n+/g, ' ')).join('\t');
    }).join('\n');

    if (tsv.trim()) {
      await navigator.clipboard.writeText(tsv);
      statusLine.setMessage(`Yanked table (${rows.length} rows) as TSV`);
      return true;
    }
    return false;
  }

  /**
   * Yank Git Clone URL if on GitHub, GitLab, or Bitbucket
   */
  static async yankGitUrl() {
    const url = new URL(window.location.href);
    const host = url.hostname;
    const parts = url.pathname.split('/').filter(Boolean);

    if ((host === 'github.com' || host === 'gitlab.com' || host.includes('gitlab')) && parts.length >= 2) {
      const user = parts[0];
      const repo = parts[1].replace(/\.git$/, '');
      const sshUrl = `git@${host}:${user}/${repo}.git`;
      await navigator.clipboard.writeText(sshUrl);
      statusLine.setMessage(`Yanked Git URL: ${sshUrl}`);
      return true;
    }

    statusLine.setMessage('Not on a supported Git repository page');
    return false;
  }

  /**
   * Yank Markdown formatted link [Title](URL)
   */
  static async yankMarkdownLink() {
    const mdLink = `[${document.title.replace(/[\[\]]/g, '')}](${window.location.href})`;
    await navigator.clipboard.writeText(mdLink);
    statusLine.setMessage('Yanked Markdown link to clipboard');
    return true;
  }

  /**
   * Generate and yank a curl command for current page
   */
  static async yankCurlCommand() {
    const curl = `curl -sL '${window.location.href}'`;
    await navigator.clipboard.writeText(curl);
    statusLine.setMessage('Yanked curl command to clipboard');
    return true;
  }
}


/* ========== FILE: src/content/navigation/scroller.js ========== */
/**
 * Helix Scroller Engine
 * Provides smooth & responsive scrolling physics and position calculation.
 */

class Scroller {
  constructor(settings = {}) {
    this.settings = {
      step: 80,
      smooth: true,
      halfPageRatio: 0.5,
      ...settings
    };
  }

  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
  }

  getScrollTarget() {
    // Find active scrollable container if focused or default to window/document
    const active = document.activeElement;
    if (active && active !== document.body && active !== document.documentElement) {
      const overflowY = window.getComputedStyle(active).overflowY;
      if (['auto', 'scroll'].includes(overflowY) && active.scrollHeight > active.clientHeight) {
        return active;
      }
    }
    return window;
  }

  scrollBy(dx, dy, smooth = this.settings.smooth) {
    const target = this.getScrollTarget();
    const behavior = smooth ? 'smooth' : 'auto';
    if (target === window) {
      window.scrollBy({ left: dx, top: dy, behavior });
    } else {
      target.scrollBy({ left: dx, top: dy, behavior });
    }
  }

  scrollTo(x, y, smooth = this.settings.smooth) {
    const target = this.getScrollTarget();
    const behavior = smooth ? 'smooth' : 'auto';
    if (target === window) {
      window.scrollTo({ left: x, top: y, behavior });
    } else {
      target.scrollTo({ left: x, top: y, behavior });
    }
  }

  down(count = 1) {
    this.scrollBy(0, this.settings.step * count);
  }

  up(count = 1) {
    this.scrollBy(0, -this.settings.step * count);
  }

  left(count = 1) {
    this.scrollBy(-this.settings.step * count, 0);
  }

  right(count = 1) {
    this.scrollBy(this.settings.step * count, 0);
  }

  halfPageDown() {
    const height = window.innerHeight;
    this.scrollBy(0, height * this.settings.halfPageRatio);
  }

  halfPageUp() {
    const height = window.innerHeight;
    this.scrollBy(0, -height * this.settings.halfPageRatio);
  }

  pageDown() {
    this.scrollBy(0, window.innerHeight * 0.9);
  }

  pageUp() {
    this.scrollBy(0, -window.innerHeight * 0.9);
  }

  top() {
    this.scrollTo(0, 0);
  }

  bottom() {
    const docHeight = Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement ? document.documentElement.scrollHeight : 0
    );
    this.scrollTo(0, docHeight);
  }

  getScrollPercentage() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight || 1) - window.innerHeight;
    
    if (scrollHeight <= 0) return 'All';
    if (scrollTop <= 5) return 'Top';
    if (scrollTop >= scrollHeight - 5) return 'Bot';
    
    const percent = Math.round((scrollTop / scrollHeight) * 100);
    return `${percent}%`;
  }
}

const scroller = new Scroller();


/* ========== FILE: src/content/navigation/traversal.js ========== */


const SELECTORS = {
  h: 'h1, h2, h3, h4, h5, h6',
  l: 'a[href]',
  i: 'input:not([type="hidden"]), textarea, select, [contenteditable="true"]',
  b: 'button, [role="button"], input[type="button"], input[type="submit"]',
  p: 'p, article, section',
  c: 'pre, code:not(pre code), .highlight, .blob-wrapper, .hljs'
};

class Traversal {
  static getVisibleElements(selector) {
    const elements = Array.from(document.querySelectorAll(selector));
    return elements.filter(el => {
      // Don't match our own shadow root
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
  }

  static jump(type, direction = 'next') {
    const selector = SELECTORS[type];
    if (!selector) return false;

    const elements = this.getVisibleElements(selector);
    if (elements.length === 0) return false;

    // Record jump list position prior to jumping
    jumpList.recordPosition();

    // Sort by vertical document position
    elements.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      const topA = rectA.top + window.scrollY;
      const topB = rectB.top + window.scrollY;
      if (Math.abs(topA - topB) > 5) return topA - topB;
      return rectA.left - rectB.left;
    });

    const currentScroll = window.scrollY;
    const viewCenter = currentScroll + window.innerHeight * 0.3;

    let targetElement = null;

    if (direction === 'next') {
      targetElement = elements.find(el => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return top > viewCenter + 15;
      });
      // Wrap around
      if (!targetElement) targetElement = elements[0];
    } else {
      const prevElements = elements.filter(el => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return top < viewCenter - 15;
      });
      targetElement = prevElements[prevElements.length - 1];
      // Wrap around
      if (!targetElement) targetElement = elements[elements.length - 1];
    }

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // If jumping to input, focus it
      if (type === 'i') {
        setTimeout(() => targetElement.focus(), 200);
      } else {
        this.flashHighlight(targetElement);
      }
      return true;
    }

    return false;
  }

  static getNearestCodeSnippet() {
    const elements = this.getVisibleElements('pre, .highlight, .blob-wrapper, .hljs, code');
    if (elements.length === 0) return null;

    const viewCenterY = window.innerHeight / 2;
    elements.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      const distA = Math.abs(rectA.top + rectA.height / 2 - viewCenterY);
      const distB = Math.abs(rectB.top + rectB.height / 2 - viewCenterY);
      return distA - distB;
    });

    const target = elements[0];
    this.flashHighlight(target);
    return target.textContent.trim();
  }

  static flashHighlight(element) {
    const originalOutline = element.style.outline;
    const originalTransition = element.style.transition;
    
    element.style.transition = 'outline 0.15s ease';
    element.style.outline = '3px solid #b4befe';
    
    setTimeout(() => {
      element.style.outline = originalOutline;
      element.style.transition = originalTransition;
    }, 600);
  }
}


/* ========== FILE: src/content/navigation/visual-caret.js ========== */
/**
 * Helix Visual Caret and Text Selection Engine
 */

class VisualCaret {
  constructor() {
    this.isActive = false;
    this.anchorNode = null;
    this.anchorOffset = 0;
  }

  start() {
    this.isActive = true;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      // Find visible text node near center of viewport
      const centerEl = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 3);
      if (centerEl) {
        const textNode = this.getFirstTextNode(centerEl);
        if (textNode) {
          const range = document.createRange();
          range.setStart(textNode, 0);
          range.setEnd(textNode, Math.min(1, textNode.textContent.length));
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }

  stop() {
    this.isActive = false;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
  }

  getFirstTextNode(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    return walker.nextNode();
  }

  move(direction, count = 1) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    for (let i = 0; i < count; i++) {
      switch (direction) {
        case 'right':
        case 'l':
          sel.modify('extend', 'forward', 'character');
          break;
        case 'left':
        case 'h':
          sel.modify('extend', 'backward', 'character');
          break;
        case 'down':
        case 'j':
          sel.modify('extend', 'forward', 'line');
          break;
        case 'up':
        case 'k':
          sel.modify('extend', 'backward', 'line');
          break;
        case 'word_forward':
        case 'w':
        case 'e':
          sel.modify('extend', 'forward', 'word');
          break;
        case 'word_backward':
        case 'b':
          sel.modify('extend', 'backward', 'word');
          break;
      }
    }

    this.ensureSelectionVisible();
  }

  selectLineOrBlock() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const node = sel.anchorNode;
    const parentBlock = node ? (node.nodeType === Node.TEXT_NODE ? node.parentElement : node) : null;
    
    if (parentBlock) {
      const range = document.createRange();
      range.selectNodeContents(parentBlock);
      sel.removeAllRanges();
      sel.addRange(range);
      this.ensureSelectionVisible();
    }
  }

  yank() {
    const sel = window.getSelection();
    if (!sel) return '';
    const text = sel.toString();
    if (text) {
      navigator.clipboard.writeText(text);
    }
    return text;
  }

  selectAll() {
    this.isActive = true;
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.selectNodeContents(document.body || document.documentElement);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  collapse() {
    this.isActive = false;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
  }

  ensureSelectionVisible() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      const targetEl = range.startContainer.parentElement;
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}

const visualCaret = new VisualCaret();


/* ========== FILE: src/content/ui/shadow-root.js ========== */
/**
 * Helix Shadow Root Container
 * Isolates all Helix UI from host webpage CSS and scripts.
 */

let hostElement = null;
let shadowRoot = null;
let currentTheme = 'helix_dark';

async function initShadowRoot(theme = 'helix_dark') {
  currentTheme = theme;
  if (document.getElementById('helix-chrome-root')) {
    hostElement = document.getElementById('helix-chrome-root');
    shadowRoot = hostElement.shadowRoot;
    setTheme(currentTheme);
    return shadowRoot;
  }

  hostElement = document.createElement('div');
  hostElement.id = 'helix-chrome-root';
  hostElement.style.position = 'absolute';
  hostElement.style.top = '0';
  hostElement.style.left = '0';
  hostElement.style.width = '100%';
  hostElement.style.height = '100%';
  hostElement.style.pointerEvents = 'none';
  hostElement.style.zIndex = '2147483647';

  shadowRoot = hostElement.attachShadow({ mode: 'open' });

  // Load CSS stylesheet
  const style = document.createElement('style');
  if (typeof INLINED_HELIX_CSS !== 'undefined') {
    style.textContent = INLINED_HELIX_CSS;
    shadowRoot.appendChild(style);
  } else {
    const cssUrl = chrome.runtime.getURL('src/content/styles/helix.css');
    try {
      const res = await fetch(cssUrl);
      const cssText = await res.text();
      style.textContent = cssText;
      shadowRoot.appendChild(style);
    } catch (e) {
      console.warn('[Helix] Failed to fetch stylesheet, linking directly:', e);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      shadowRoot.appendChild(link);
    }
  }

  // Wrapper container for applying theme classes
  const container = document.createElement('div');
  container.id = 'hx-container';
  container.className = `theme-${currentTheme}`;
  shadowRoot.appendChild(container);

  // Append host to document safely
  const mountToDoc = () => {
    if (!document.getElementById('helix-chrome-root')) {
      if (document.body) {
        document.body.appendChild(hostElement);
      } else if (document.documentElement) {
        document.documentElement.appendChild(hostElement);
      }
    }
  };

  mountToDoc();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountToDoc);
  }

  return shadowRoot;
}

function getShadowContainer() {
  if (!shadowRoot) return null;
  return shadowRoot.getElementById('hx-container');
}

function getShadowRoot() {
  return shadowRoot;
}

function setTheme(themeName) {
  currentTheme = themeName;
  const container = getShadowContainer();
  if (container) {
    container.className = `theme-${themeName}`;
  }
}


/* ========== FILE: src/content/ui/statusline.js ========== */
/**
 * Helix Bottom Status Line Component
 */




class StatusLine {
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
      <span class="hx-mode-badge mode-${modeClass}">${modeText}</span>
      <span class="hx-status-keys" style="display: none;"></span>
      <span class="hx-status-message" style="display: none;"></span>
      <span class="hx-status-scroll">Top</span>
    `;

    this.modeEl = this.element.querySelector('.hx-mode-badge');
    this.messageEl = this.element.querySelector('.hx-status-message');
    this.keysEl = this.element.querySelector('.hx-status-keys');
    this.scrollEl = this.element.querySelector('.hx-status-scroll');
    this.titleEl = null;

    this.setMode(this.currentModeCode, this.currentModeLabel);
    this.updateScroll();

    container.appendChild(this.element);

    // Update scroll percentage on scroll
    window.addEventListener('scroll', () => this.updateScroll(), { passive: true });

    // Proximity fade when mouse cursor gets near the HUD pill
    window.addEventListener('mousemove', (e) => {
      if (!this.element) return;
      const rect = this.element.getBoundingClientRect();
      const pad = 24;
      if (
        e.clientX >= rect.left - pad &&
        e.clientX <= rect.right + pad &&
        e.clientY >= rect.top - pad &&
        e.clientY <= rect.bottom + pad
      ) {
        this.element.classList.add('hx-hud-dimmed');
      } else {
        this.element.classList.remove('hx-hud-dimmed');
      }
    }, { passive: true });
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
    this.messageEl.style.display = text ? 'inline-block' : 'none';
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    if (durationMs > 0) {
      this.messageTimeout = setTimeout(() => {
        if (this.messageEl) {
          this.messageEl.textContent = '';
          this.messageEl.style.display = 'none';
        }
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

const statusLine = new StatusLine();


/* ========== FILE: src/content/ui/which-key.js ========== */
/**
 * Helix Which-Key Popup Guide
 * Displays available keyboard chords and actions dynamically.
 */



const MENUS = {
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

class WhichKey {
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

const whichKey = new WhichKey();


/* ========== FILE: src/content/ui/reader.js ========== */
/**
 * Minimalist Helix Reader / Zen Mode
 * Renders an isolated, distraction-free reading experience inside Shadow DOM.
 */





class ReaderMode {
  constructor() {
    this.element = null;
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.close();

    const container = getShadowContainer();
    if (!container) return;

    // Extract title and main article content
    const title = document.title || 'Untitled Article';
    const mainEl = document.querySelector('article, main, [role="main"], .post-content, #content') || document.body;
    const clone = mainEl.cloneNode(true);
    clone.querySelectorAll('script, style, nav, footer, #helix-chrome-root, noscript, iframe, .ad, .advertisement, [aria-hidden="true"]').forEach(el => el.remove());

    const md = CliUtils.htmlToMarkdown(clone);

    this.element = document.createElement('div');
    this.element.className = 'hx-reader-overlay';

    // Simple markdown-to-html renderer for reader overlay
    const htmlContent = this.renderMarkdown(md);

    this.element.innerHTML = `
      <div class="hx-reader-container">
        <div class="hx-reader-header">
          <span class="hx-reader-tag">ZEN READER</span>
          <button class="hx-reader-close-btn" title="Close (Esc or q)">✕ Close</button>
        </div>
        <h1 class="hx-reader-title">${this.escapeHtml(title)}</h1>
        <div class="hx-reader-content">
          ${htmlContent}
        </div>
      </div>
    `;

    this.element.querySelector('.hx-reader-close-btn').addEventListener('click', () => this.close());

    container.appendChild(this.element);
    this.isOpen = true;
    statusLine.setMessage('Zen Reader active. Press Esc or q to exit.');
  }

  close() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.isOpen = false;
  }

  escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }

  renderMarkdown(md) {
    const lines = md.split('\n');
    let html = '';
    let inCode = false;
    let codeBuffer = '';

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCode) {
          html += `<pre class="hx-reader-code"><code>${this.escapeHtml(codeBuffer.trim())}</code></pre>`;
          codeBuffer = '';
          inCode = false;
        } else {
          inCode = true;
        }
        continue;
      }

      if (inCode) {
        codeBuffer += line + '\n';
        continue;
      }

      if (line.startsWith('# ')) {
        html += `<h2>${this.escapeHtml(line.slice(2))}</h2>`;
      } else if (line.startsWith('## ')) {
        html += `<h3>${this.escapeHtml(line.slice(3))}</h3>`;
      } else if (line.startsWith('### ')) {
        html += `<h4>${this.escapeHtml(line.slice(4))}</h4>`;
      } else if (line.startsWith('> ')) {
        html += `<blockquote>${this.escapeHtml(line.slice(2))}</blockquote>`;
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        html += `<li>${this.escapeHtml(line.slice(2))}</li>`;
      } else if (line.trim().length > 0) {
        html += `<p>${this.escapeHtml(line)}</p>`;
      }
    }

    if (inCode && codeBuffer) {
      html += `<pre class="hx-reader-code"><code>${this.escapeHtml(codeBuffer.trim())}</code></pre>`;
    }

    return html;
  }
}

const readerMode = new ReaderMode();


/* ========== FILE: src/content/ui/hints.js ========== */
/**
 * Helix Link and Element Hinting System
 * Renders optimal 2-letter keyboard hints on clickable DOM elements.
 */



class HintManager {
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

const hintManager = new HintManager();


/* ========== FILE: src/content/ui/search-bar.js ========== */
/**
 * Helix In-Page Search Engine and Overlay (/ and ?)
 */




class SearchBar {
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

const searchBar = new SearchBar();


/* ========== FILE: src/content/ui/command-bar.js ========== */
/**
 * Helix Command Bar and Prompt System (:)
 */






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

class CommandBar {
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
        statusLine.setMessage('Press Space for Menu, g for Goto (gw hints), [ or ] for Jumps, / to Search', 6000);
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

const commandBar = new CommandBar();



/* ========== FILE: src/content/ui/tab-picker.js ========== */
/**
 * Helix Buffer / Tab / Bookmark / History Fuzzy Picker (<Space>b, <Space>f, <Space>h)
 */



class TabPicker {
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

const tabPicker = new TabPicker();


/* ========== FILE: src/content/state.js ========== */
/**
 * Helix Modal State Machine
 */









const MODES = {
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

class StateManager {
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

  getModeLabel() {
    return MODE_LABELS[this.currentMode] || this.currentMode;
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

const stateManager = new StateManager();

function getDeepActiveElement(root = document) {
  let el = root.activeElement;
  while (el && el.shadowRoot && el.shadowRoot.activeElement) {
    el = el.shadowRoot.activeElement;
  }
  return el;
}

function isEditableElement(el) {
  if (!el) return false;
  // Ignore any element inside the Helix Shadow DOM
  const root = typeof el.getRootNode === 'function' ? el.getRootNode() : null;
  if (root && root instanceof ShadowRoot) {
    if (root.host && (root.host.id === 'helix-chrome-root' || root.host.closest?.('#helix-chrome-root'))) {
      return false;
    }
  }
  if (el.closest && el.closest('#helix-chrome-root')) return false;

  const tag = el.tagName ? el.tagName.toLowerCase() : '';
  if (tag === 'input') {
    const nonTextTypes = ['button', 'submit', 'checkbox', 'radio', 'file', 'hidden', 'image', 'reset'];
    return !nonTextTypes.includes(el.type);
  }
  if (tag === 'textarea') return true;
  if (el.isContentEditable) return true;

  const role = el.getAttribute?.('role');
  if (role && ['textbox', 'searchbox', 'combobox'].includes(role)) {
    return true;
  }

  return false;
}


/* ========== FILE: src/content/keymap/helix-keys.js ========== */












class KeyDispatcher {
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

    // Helix selection & search motions
    if (key === '%') {
      event.preventDefault();
      visualCaret.selectAll();
      stateManager.setMode(MODES.SELECT);
      statusLine.setMessage('Selected entire document (%)');
      return;
    }
    if (key === '*') {
      event.preventDefault();
      this.searchSelection();
      return;
    }
    if (key === ';') {
      event.preventDefault();
      visualCaret.collapse();
      if (stateManager.getMode() === MODES.SELECT) {
        stateManager.setMode(MODES.NORMAL);
      }
      statusLine.setMessage('Selection collapsed (;)');
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
      case ';':
        visualCaret.collapse();
        stateManager.setMode(MODES.NORMAL);
        statusLine.setMessage('Selection collapsed (;)');
        break;
      case '%':
        visualCaret.selectAll();
        statusLine.setMessage('Selected entire document (%)');
        break;
      case '*':
        this.searchSelection();
        break;
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
      case 'w':
        jumpList.recordPosition();
        stateManager.setMode(MODES.HINT, { hintAction: 'click' });
        break;
      case 'W':
        stateManager.setMode(MODES.HINT, { hintAction: 'newTab' });
        break;
      case 'g':
        jumpList.recordPosition();
        scroller.top();
        statusLine.setMessage('Top of page (gg)');
        break;
      case 'e':
        jumpList.recordPosition();
        scroller.bottom();
        statusLine.setMessage('Bottom of page (ge)');
        break;
      case 't': {
        jumpList.recordPosition();
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          scroller.scrollBy(0, -window.innerHeight * 0.4);
        }
        statusLine.setMessage('Window top (gt)');
        break;
      }
      case 'c': {
        jumpList.recordPosition();
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollBy({ top: 0, behavior: 'smooth' });
        }
        statusLine.setMessage('Window center (gc)');
        break;
      }
      case 'b': {
        jumpList.recordPosition();
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
          scroller.scrollBy(0, window.innerHeight * 0.4);
        }
        statusLine.setMessage('Window bottom (gb)');
        break;
      }
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
      case 'h': {
        jumpList.recordPosition();
        scroller.scrollTo(0, window.scrollY);
        statusLine.setMessage('Line / Page start (gh)');
        break;
      }
      case 'l': {
        jumpList.recordPosition();
        const docWidth = Math.max(
          document.body ? document.body.scrollWidth : 0,
          document.documentElement ? document.documentElement.scrollWidth : 0
        );
        scroller.scrollTo(Math.max(0, docWidth - window.innerWidth), window.scrollY);
        statusLine.setMessage('Line / Page end (gl)');
        break;
      }
      case '<':
      case ',':
      case 'H':
        window.history.back();
        break;
      case '>':
      case '.':
      case 'L':
        window.history.forward();
        break;
      case 'n':
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

    if (key === 't' || key === 'b') {
      if (direction === 'next') chrome.runtime.sendMessage({ type: 'NEXT_TAB' });
      else chrome.runtime.sendMessage({ type: 'PREV_TAB' });
      return;
    }

    if (['h', 'l', 'i', 'p', 'c'].includes(key)) {
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
      case 'z':
      case 'c': {
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          statusLine.setMessage('Center view (zz)');
        }
        break;
      }
      case 't':
      case 'k': {
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          scroller.scrollBy(0, -window.innerHeight * 0.35);
          statusLine.setMessage('Align top (zt)');
        }
        break;
      }
      case 'b':
      case 'j': {
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
          scroller.scrollBy(0, window.innerHeight * 0.35);
          statusLine.setMessage('Align bottom (zb)');
        }
        break;
      }
      case 'i':
        chrome.runtime.sendMessage({ type: 'ZOOM', action: 'in' });
        break;
      case 'o':
        chrome.runtime.sendMessage({ type: 'ZOOM', action: 'out' });
        break;
      case '0':
        chrome.runtime.sendMessage({ type: 'ZOOM', action: 'reset' });
        break;
    }
  }

  searchSelection() {
    let query = window.getSelection().toString().trim();
    if (!query) {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        query = active.value.substring(active.selectionStart, active.selectionEnd).trim();
      }
    }
    if (query) {
      jumpList.recordPosition();
      searchBar.lastQuery = query;
      searchBar.findNext();
      statusLine.setMessage(`Search: "${query}" (*)`);
    } else {
      statusLine.setMessage('No text selected to search (*)');
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

const keyDispatcher = new KeyDispatcher();



/* ========== FILE: src/content/index.js ========== */
/**
 * T68k Browser Helix - Content Script Entry Point
 */








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

  // Sync mode with current focus before/during mounting status line
  syncModeWithFocus();

  // Mount Helix Status Line
  statusLine.mount(stateManager.getMode(), stateManager.getModeLabel());

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
  const handleFocusIn = (e) => {
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
  };

  window.addEventListener('focusin', handleFocusIn, true);
  window.addEventListener('focus', handleFocusIn, true);

  const handleFocusOut = (e) => {
    const mode = stateManager.getMode();
    if (mode !== MODES.INSERT) return;
    const target = e.target;
    if (isEditableElement(target)) {
      setTimeout(() => {
        if (!isEditableElement(getDeepActiveElement()) && stateManager.getMode() === MODES.INSERT) {
          stateManager.setMode(MODES.NORMAL);
        }
      }, 50);
    }
  };

  window.addEventListener('focusout', handleFocusOut, true);

  // Lifecycle listeners to catch autofocused inputs on reload / navigation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncModeWithFocus);
  } else {
    syncModeWithFocus();
  }
  window.addEventListener('load', syncModeWithFocus);
  window.addEventListener('pageshow', syncModeWithFocus);

  // Staggered checks to catch deferred scripts/frameworks autofocusing inputs after reload
  [0, 50, 150, 300, 600, 1000].forEach((delay) => {
    setTimeout(syncModeWithFocus, delay);
  });

  // Observe dynamically inserted autofocus elements (e.g. form reload / AJAX)
  try {
    const autofocusObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (let i = 0; i < m.addedNodes.length; i++) {
          const node = m.addedNodes[i];
          if (node.nodeType === 1) {
            if (node.hasAttribute?.('autofocus') || (node.firstElementChild && node.querySelector?.('[autofocus]'))) {
              syncModeWithFocus();
              return;
            }
          }
        }
      }
    });
    autofocusObserver.observe(document.documentElement || document, { childList: true, subtree: true });
    setTimeout(() => autofocusObserver.disconnect(), 5000);
  } catch (e) {}

  console.log('[Helix] Browser Navigation active. Press Space or ? for help.');
}

function syncModeWithFocus() {
  if (stateManager.isBlacklisted) return;
  const activeEl = getDeepActiveElement();
  if (isEditableElement(activeEl)) {
    const mode = stateManager.getMode();
    if (
      mode !== MODES.INSERT &&
      mode !== MODES.SEARCH &&
      mode !== MODES.COMMAND &&
      mode !== MODES.PICKER &&
      mode !== MODES.HINT
    ) {
      stateManager.setMode(MODES.INSERT);
    }
  } else {
    // Check if there is an autofocus element that the browser should focus
    const autofocusEl = document.querySelector('input[autofocus], textarea[autofocus], [contenteditable="true"][autofocus]');
    if (autofocusEl && isEditableElement(autofocusEl) && (!document.activeElement || document.activeElement === document.body)) {
      try {
        autofocusEl.focus();
        if (stateManager.getMode() !== MODES.INSERT) {
          stateManager.setMode(MODES.INSERT);
        }
      } catch (e) {}
    }
  }
}

// Start
initHelix();


})();
