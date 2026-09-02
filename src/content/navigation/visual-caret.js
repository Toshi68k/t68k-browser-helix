/**
 * Helix Visual Caret and Text Selection Engine
 */

export class VisualCaret {
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

export const visualCaret = new VisualCaret();
