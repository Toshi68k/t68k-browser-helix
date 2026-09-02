/**
 * CLI and Helix Data Extraction & Yank Utilities
 */

import { statusLine } from '../ui/statusline.js';

export class CliUtils {
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
