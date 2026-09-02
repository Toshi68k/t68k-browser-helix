/**
 * Helix-style Jump List Manager (Ctrl-o / Ctrl-i)
 * Tracks scroll and jump history across headings, search matches, and DOM jumps.
 */

import { statusLine } from '../ui/statusline.js';

export class JumpList {
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

export const jumpList = new JumpList();
