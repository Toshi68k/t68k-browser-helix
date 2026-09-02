/**
 * Helix Scroller Engine
 * Provides smooth & responsive scrolling physics and position calculation.
 */

export class Scroller {
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

export const scroller = new Scroller();
