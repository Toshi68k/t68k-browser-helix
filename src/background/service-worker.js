/**
 * T68k Browser Helix - Background Service Worker (Manifest V3)
 */

const DEFAULT_SETTINGS = {
  theme: 'helix_dark',
  scrollStep: 80,
  scrollHalfRatio: 0.5,
  hintCharacters: 'fjdkslaeiruvncmghwoqptyzb',
  smoothScroll: true,
  escapeSequence: 'jk',
  blacklist: [
    'https://docs.google.com/*',
    'https://drive.google.com/*'
  ],
  customBindings: {}
};

// Initialize settings on installation
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.sync.get('settings');
  if (!data.settings) {
    await chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
  }
  console.log('[Helix] Background Service Worker initialized.');
});

// Recently closed tabs stack (as a fallback/quick tracker)
let closedTabStack = [];

// Track previous and current active tab per window for 'ga' (alternate tab)
const activeTabHistory = {}; // windowId -> { current: tabId, previous: tabId }

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const { tabId, windowId } = activeInfo;
  if (!activeTabHistory[windowId]) {
    activeTabHistory[windowId] = { current: tabId, previous: null };
  } else {
    if (activeTabHistory[windowId].current !== tabId) {
      activeTabHistory[windowId].previous = activeTabHistory[windowId].current;
      activeTabHistory[windowId].current = tabId;
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  const windowId = removeInfo.windowId;
  if (activeTabHistory[windowId]) {
    if (activeTabHistory[windowId].current === tabId) {
      activeTabHistory[windowId].current = activeTabHistory[windowId].previous;
      activeTabHistory[windowId].previous = null;
    } else if (activeTabHistory[windowId].previous === tabId) {
      activeTabHistory[windowId].previous = null;
    }
  }
});

// Message router
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handler = async () => {
    switch (message.type) {
      case 'GET_TABS': {
        const query = message.currentWindow ? { currentWindow: true } : {};
        const tabs = await chrome.tabs.query(query);
        return { tabs };
      }

      case 'SWITCH_TAB': {
        const { tabId, windowId } = message;
        if (windowId) {
          await chrome.windows.update(windowId, { focused: true });
        }
        const updated = await chrome.tabs.update(tabId, { active: true });
        return { success: true, tab: updated };
      }

      case 'SWITCH_ALTERNATE_TAB': {
        const windowId = sender?.tab?.windowId;
        if (windowId && activeTabHistory[windowId]?.previous) {
          const prevTabId = activeTabHistory[windowId].previous;
          try {
            const updated = await chrome.tabs.update(prevTabId, { active: true });
            return { success: true, tab: updated };
          } catch (e) {
            return { success: false, error: 'Previous tab no longer available' };
          }
        }
        return { success: false, error: 'No alternate tab recorded' };
      }

      case 'NEW_TAB': {
        const { url, active = true } = message;
        const targetUrl = url ? (url.includes('://') ? url : `https://${url}`) : undefined;
        const newTab = await chrome.tabs.create({
          url: targetUrl,
          active
        });
        return { success: true, tab: newTab };
      }

      case 'CLOSE_TAB': {
        const targetTabId = message.tabId || sender?.tab?.id;
        if (targetTabId) {
          await chrome.tabs.remove(targetTabId);
          return { success: true };
        }
        return { success: false, error: 'No tab id' };
      }

      case 'CLOSE_OTHER_TABS': {
        const currentTabId = sender?.tab?.id;
        if (currentTabId) {
          const tabs = await chrome.tabs.query({ currentWindow: true });
          const otherTabIds = tabs.filter(t => t.id !== currentTabId && !t.pinned).map(t => t.id);
          if (otherTabIds.length > 0) {
            await chrome.tabs.remove(otherTabIds);
          }
          return { success: true, count: otherTabIds.length };
        }
        return { success: false };
      }

      case 'TOGGLE_PIN_TAB': {
        const tab = sender?.tab;
        if (tab) {
          const updated = await chrome.tabs.update(tab.id, { pinned: !tab.pinned });
          return { success: true, pinned: updated.pinned };
        }
        return { success: false };
      }

      case 'TOGGLE_MUTE_TAB': {
        const tab = sender?.tab;
        if (tab) {
          const isMuted = tab.mutedInfo ? tab.mutedInfo.muted : false;
          const updated = await chrome.tabs.update(tab.id, { muted: !isMuted });
          return { success: true, muted: updated.mutedInfo?.muted };
        }
        return { success: false };
      }

      case 'SPLIT_WINDOW': {
        const currentTab = sender?.tab;
        const currentWin = await chrome.windows.getCurrent();
        if (currentTab && currentWin) {
          const halfWidth = Math.floor((currentWin.width || 1200) / 2);
          const height = currentWin.height || 800;
          const top = currentWin.top || 0;
          const left = currentWin.left || 0;

          // Resize current window to left half
          await chrome.windows.update(currentWin.id, {
            left: left,
            top: top,
            width: halfWidth,
            height: height
          });

          // Create new window with current tab or duplicate on right half
          const newWin = await chrome.windows.create({
            url: message.url || currentTab.url,
            left: left + halfWidth,
            top: top,
            width: halfWidth,
            height: height,
            focused: true
          });
          return { success: true, window: newWin };
        }
        return { success: false };
      }

      case 'RESTORE_TAB': {
        if (chrome.sessions && chrome.sessions.restore) {
          const restored = await chrome.sessions.restore();
          return { success: true, restored };
        }
        return { success: false, error: 'Sessions API not available' };
      }

      case 'NEXT_TAB':
      case 'PREV_TAB': {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        const currentIdx = tabs.findIndex(t => t.id === sender.tab.id);
        if (currentIdx !== -1 && tabs.length > 1) {
          let nextIdx;
          if (message.type === 'NEXT_TAB') {
            nextIdx = (currentIdx + 1) % tabs.length;
          } else {
            nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
          }
          await chrome.tabs.update(tabs[nextIdx].id, { active: true });
          return { success: true, targetTab: tabs[nextIdx] };
        }
        return { success: false };
      }

      case 'MOVE_TAB': {
        const { direction } = message; // 'left' or 'right'
        if (!sender.tab) return { success: false };
        const tabs = await chrome.tabs.query({ currentWindow: true });
        const currentIdx = sender.tab.index;
        let newIdx = direction === 'left' ? currentIdx - 1 : currentIdx + 1;
        newIdx = Math.max(0, Math.min(tabs.length - 1, newIdx));
        if (newIdx !== currentIdx) {
          await chrome.tabs.move(sender.tab.id, { index: newIdx });
          return { success: true };
        }
        return { success: false };
      }

      case 'DUPLICATE_TAB': {
        const tabId = message.tabId || sender?.tab?.id;
        if (tabId) {
          const dup = await chrome.tabs.duplicate(tabId);
          return { success: true, tab: dup };
        }
        return { success: false };
      }

      case 'SEARCH_BOOKMARKS': {
        const query = message.query || '';
        const results = await chrome.bookmarks.search(query);
        return { results: results.slice(0, 50) };
      }

      case 'SEARCH_HISTORY': {
        const query = message.query || '';
        const results = await chrome.history.search({
          text: query,
          maxResults: 50,
          startTime: 0
        });
        return { results };
      }

      case 'GET_SETTINGS': {
        const data = await chrome.storage.sync.get('settings');
        return { settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) } };
      }

      case 'SAVE_SETTINGS': {
        const current = (await chrome.storage.sync.get('settings')).settings || DEFAULT_SETTINGS;
        const updated = { ...current, ...message.settings };
        await chrome.storage.sync.set({ settings: updated });
        return { success: true, settings: updated };
      }

      case 'OPEN_OPTIONS': {
        chrome.runtime.openOptionsPage();
        return { success: true };
      }

      case 'ZOOM': {
        const { action } = message; // 'in', 'out', 'reset'
        const currentZoom = await chrome.tabs.getZoom(sender.tab.id);
        let newZoom = currentZoom;
        if (action === 'in') newZoom = Math.min(3.0, currentZoom + 0.1);
        else if (action === 'out') newZoom = Math.max(0.3, currentZoom - 0.1);
        else if (action === 'reset') newZoom = 1.0;
        await chrome.tabs.setZoom(sender.tab.id, newZoom);
        return { success: true, zoom: Math.round(newZoom * 100) };
      }

      default:
        return { error: `Unknown action: ${message.type}` };
    }
  };

  handler()
    .then(response => sendResponse(response))
    .catch(err => sendResponse({ error: err.message }));

  return true; // async sendResponse
});
