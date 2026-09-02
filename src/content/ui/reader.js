/**
 * Minimalist Helix Reader / Zen Mode
 * Renders an isolated, distraction-free reading experience inside Shadow DOM.
 */

import { getShadowContainer } from './shadow-root.js';
import { CliUtils } from '../navigation/cli-utils.js';
import { statusLine } from './statusline.js';

export class ReaderMode {
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

export const readerMode = new ReaderMode();
