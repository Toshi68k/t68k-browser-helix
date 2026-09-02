/**
 * Helix Options Page Controller
 */

let currentSettings = {
  theme: 'helix_dark',
  scrollStep: 80,
  scrollHalfRatio: 0.5,
  hintCharacters: 'fjdkslaeiruvncmghwoqptyzb',
  smoothScroll: true,
  escapeSequence: 'jk',
  blacklist: []
};

let saveTimeout = null;

async function initOptions() {
  setupTabs();
  await loadSettings();
  setupEventListeners();
}

function setupTabs() {
  const buttons = document.querySelectorAll('.hx-nav-btn');
  const panels = document.querySelectorAll('.hx-panel');
  const titleEl = document.getElementById('tab-title');

  const titles = {
    general: 'General Settings',
    appearance: 'Themes & Visual Style',
    keymap: 'Keybindings & Shortcuts',
    blacklist: 'Excluded Sites'
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(`panel-${tab}`);
      if (panel) panel.classList.add('active');

      if (titleEl && titles[tab]) titleEl.textContent = titles[tab];
    });
  });
}

async function loadSettings() {
  const res = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
  if (res && res.settings) {
    currentSettings = { ...currentSettings, ...res.settings };
  }

  // Populate fields
  const scrollStep = document.getElementById('scrollStep');
  const scrollStepVal = document.getElementById('scrollStepVal');
  if (scrollStep && scrollStepVal) {
    scrollStep.value = currentSettings.scrollStep;
    scrollStepVal.textContent = `${currentSettings.scrollStep}px`;
  }

  const scrollHalfRatio = document.getElementById('scrollHalfRatio');
  const scrollHalfRatioVal = document.getElementById('scrollHalfRatioVal');
  if (scrollHalfRatio && scrollHalfRatioVal) {
    scrollHalfRatio.value = currentSettings.scrollHalfRatio;
    scrollHalfRatioVal.textContent = `${Math.round(currentSettings.scrollHalfRatio * 100)}%`;
  }

  const smoothScroll = document.getElementById('smoothScroll');
  if (smoothScroll) {
    smoothScroll.checked = currentSettings.smoothScroll;
  }

  const hintCharacters = document.getElementById('hintCharacters');
  if (hintCharacters) {
    hintCharacters.value = currentSettings.hintCharacters;
  }

  const escapeSequence = document.getElementById('escapeSequence');
  if (escapeSequence) {
    escapeSequence.value = currentSettings.escapeSequence;
  }

  const blacklist = document.getElementById('blacklist');
  if (blacklist) {
    blacklist.value = (currentSettings.blacklist || []).join('\n');
  }

  // Highlight active theme
  selectTheme(currentSettings.theme || 'helix_dark', false);
}

function setupEventListeners() {
  // Sliders
  const scrollStep = document.getElementById('scrollStep');
  const scrollStepVal = document.getElementById('scrollStepVal');
  scrollStep.addEventListener('input', () => {
    scrollStepVal.textContent = `${scrollStep.value}px`;
    currentSettings.scrollStep = parseInt(scrollStep.value, 10);
    triggerSave();
  });

  const scrollHalfRatio = document.getElementById('scrollHalfRatio');
  const scrollHalfRatioVal = document.getElementById('scrollHalfRatioVal');
  scrollHalfRatio.addEventListener('input', () => {
    scrollHalfRatioVal.textContent = `${Math.round(scrollHalfRatio.value * 100)}%`;
    currentSettings.scrollHalfRatio = parseFloat(scrollHalfRatio.value);
    triggerSave();
  });

  // Checkbox
  const smoothScroll = document.getElementById('smoothScroll');
  smoothScroll.addEventListener('change', () => {
    currentSettings.smoothScroll = smoothScroll.checked;
    triggerSave();
  });

  // Text inputs
  const hintCharacters = document.getElementById('hintCharacters');
  hintCharacters.addEventListener('input', () => {
    currentSettings.hintCharacters = hintCharacters.value.trim();
    triggerSave();
  });

  const escapeSequence = document.getElementById('escapeSequence');
  escapeSequence.addEventListener('input', () => {
    currentSettings.escapeSequence = escapeSequence.value.trim();
    triggerSave();
  });

  const blacklist = document.getElementById('blacklist');
  blacklist.addEventListener('input', () => {
    currentSettings.blacklist = blacklist.value.split('\n').map(s => s.trim()).filter(Boolean);
    triggerSave();
  });

  // Theme options
  document.querySelectorAll('.hx-theme-option').forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.getAttribute('data-theme');
      selectTheme(theme, true);
    });
  });
}

function selectTheme(themeName, shouldSave = true) {
  document.querySelectorAll('.hx-theme-option').forEach(card => {
    if (card.getAttribute('data-theme') === themeName) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  document.body.className = `theme-${themeName}`;
  currentSettings.theme = themeName;
  if (shouldSave) triggerSave();
}

function triggerSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    await chrome.runtime.sendMessage({
      type: 'SAVE_SETTINGS',
      settings: currentSettings
    });

    const status = document.getElementById('save-status');
    if (status) {
      status.classList.add('visible');
      setTimeout(() => status.classList.remove('visible'), 2000);
    }
  }, 300);
}

document.addEventListener('DOMContentLoaded', initOptions);
