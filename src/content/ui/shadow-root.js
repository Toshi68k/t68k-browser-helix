/**
 * Helix Shadow Root Container
 * Isolates all Helix UI from host webpage CSS and scripts.
 */

let hostElement = null;
let shadowRoot = null;
let currentTheme = 'helix_dark';

export async function initShadowRoot(theme = 'helix_dark') {
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

export function getShadowContainer() {
  if (!shadowRoot) return null;
  return shadowRoot.getElementById('hx-container');
}

export function getShadowRoot() {
  return shadowRoot;
}

export function setTheme(themeName) {
  currentTheme = themeName;
  const container = getShadowContainer();
  if (container) {
    container.className = `theme-${themeName}`;
  }
}
