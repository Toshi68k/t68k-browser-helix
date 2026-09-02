import { jumpList } from './jump-list.js';

const SELECTORS = {
  h: 'h1, h2, h3, h4, h5, h6',
  l: 'a[href]',
  i: 'input:not([type="hidden"]), textarea, select, [contenteditable="true"]',
  b: 'button, [role="button"], input[type="button"], input[type="submit"]',
  p: 'p, article, section',
  c: 'pre, code:not(pre code), .highlight, .blob-wrapper, .hljs'
};

export class Traversal {
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
