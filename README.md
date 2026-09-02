# T68k Browser Helix - Simple Chrome/Firefox Navigation Extension

[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg)]()
[![Theme](https://img.shields.io/badge/Theme-Light%20%7C%20Dark-orange.svg)]()

**T68k Browser Helix** is a modal, selection-first, which-key powered browser navigation extension inspired by the **Helix Editor**.

---

## ✨ Features

- **Modal Architecture**: `NOR` (Normal), `INS` (Insert), `HNT` (Hint), `SEL` (Visual Caret), `SRC` (Search), `CMD` (Command), and `SPC` (Space menu).
- **Helix-Style Which-Key Floating Guides**: Pressing `<Space>`, `g`, `[`, `]`, `y`, or `z` brings up floating menus detailing available actions.
- **Jump List History (`Ctrl-o` / `Ctrl-i`)**: Jump backwards and forwards through your scroll and navigation history.
- **Alternate Tab Memory (`ga` / `:b#`)**: Instantly toggle back to your previously active tab.
- **Code Block Traversal & Quick Extraction (`]c` / `[c` / `yc`)**: Jump across code blocks and yank code snippets directly to clipboard.
- **Goto First Input (`gi`)**: Jump straight to search bars and form fields in Insert mode.
- **CLI-Style Yank Utilities**:
  - `ym` / `:markdown` — Yank selection or article formatted as Markdown.
  - `yt` / `:table` — Convert nearest HTML table into TSV for terminal pipelines.
  - `yg` / `:git` — Yank `git clone` SSH URL on GitHub/GitLab repositories.
  - `yl` — Yank `[Page Title](URL)` Markdown link.
- **CLI Search Bangs in (`:open`)**: Fast search queries using `!gh`, `!so`, `!yt`, `!w`, `!npm`, `!crates`, `!mdn`, `!ddg`.
- **Zen / Reader Mode (`:zen` / `<Space> z`)**: Distraction-free terminal/Helix-styled reading view.
- **Link & Element Hinting (`f`, `F`, `yf`)**: Optimal 1-2 character keyboard markers over links, buttons, inputs, and clickable elements.
- **Fuzzy Tab & Buffer Switcher (`<Space> b`)**: Helix-like buffer picker for instant tab switching with fuzzy search.
- **In-Page Interactive Search (`/`, `?`, `n`, `N`)**: Live match counts and smooth cycling.
- **Helix Command Prompt (`:`)**: Interactive command palette with autocompletion (`:open`, `:tabnew`, `:b`, `:pin`, `:mute`, `:only`, `:split`, `:zen`, `:curl`, `:theme`, `:reload`, `:close`, `:settings`).
- **Pair & Bracket Navigation (`[` and `]`)**: Jump directly across code blocks (`]c`/`[c`), headings (`]h`/`[h`), links (`]l`/`[l`), inputs (`]i`/`[i`), buttons (`]b`/`[b`), and paragraphs (`]p`/`[p`).
- **Encapsulated Shadow DOM**: Status bar, search bar, hints, reader overlay, and modals are rendered inside a closed-style Shadow DOM to eliminate CSS conflicts on any website.
- **Helix Color Themes**: `Helix Dark` and `Catppuccin Mocha`.

---

## 🚀 Installation

0. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/Toshi68k/t68k-browser-helix.git
   ```

### Chromium-based browsers

1. Open your browser and navigate to the Extensions page:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `t68k-browser-helix` project folder.

### 🦊 Firefox

1. Open your browser and navigate the Debugging page:
   - `about:debugging#/runtime/this-firefox`
2. Click **Load temporary add-on...**.
3. Select the `manifest.json` file in the project folder.

---

## ⌨️ Keybinding Reference

### Normal Mode (`NOR`)
| Key | Action |
| :--- | :--- |
| `Ctrl-o` / `Ctrl-i` | Jump backward / forward in Jump List stack |
| `j` / `k` | Scroll down / up (supports counts like `5j`, `10k`) |
| `h` / `l` | Scroll left / right |
| `d` / `u` | Half-page scroll down / up (`Ctrl-d` / `Ctrl-u`) |
| `f` | Hint mode: click target element in current tab |
| `F` | Hint mode: open target link in background tab |
| `v` | Toggle Visual / Selection mode |
| `x` | Select current DOM line / paragraph block |
| `/` / `?` | Search page forward / backward |
| `n` / `N` | Jump to next / previous search match |
| `:` | Open Command Prompt |
| `<Space>` | Open Which-Key Space menu |
| `<Space> b` | Open Fuzzy Tab / Buffer Switcher |
| `<Space> f` | Search bookmarks |
| `<Space> h` | Search history |
| `<Space> z` | Toggle Zen / Reader Mode |
| `<Space> p` | Toggle Tab Pin |
| `<Space> m` | Toggle Tab Mute |
| `<Space> s` | Split window into side-by-side tile |
| `g g` / `g e` | Jump to top / bottom of page |
| `g a` | Jump to Alternate / previous active tab |
| `g i` | Jump to first text input / search field in Insert mode |
| `g s` | View page source (`view-source:`) |
| `g h` / `g l` | History back / forward (`H` / `L`) |
| `g t` / `g p` | Next / previous tab (`J` / `K`) |
| `g u` | Go up URL directory hierarchy |
| `r` / `R` | Reload page / Hard reload page |
| `y y` / `y p` | Yank current URL / page title to clipboard |
| `y c` | Yank nearest code block snippet |
| `y m` | Yank selection or article as Markdown |
| `y t` | Yank nearest HTML table as TSV format |
| `y g` | Yank Git clone SSH URL (on GitHub/GitLab) |
| `y l` | Yank Markdown link `[Title](URL)` |
| `y f` | Yank target link URL via hint tags |
| `p` / `P` | Open clipboard URL in current / new tab |
| `]c` / `[c` | Jump to next / previous code snippet (`<pre><code>`) |
| `]h` / `[h` | Jump to next / previous heading (`h1-h6`) |
| `]l` / `[l` | Jump to next / previous link |
| `]i` / `[i` | Jump to next / previous form input field |
| `]b` / `[b` | Jump to next / previous button |
| `]p` / `[p` | Jump to next / previous paragraph |
| `z i` / `z o` / `z 0` | Zoom in / Zoom out / Zoom reset |

### Visual / Selection Mode (`SEL`)
| Key | Action |
| :--- | :--- |
| `h` / `j` / `k` / `l` | Extend selection by character / line |
| `w` / `e` | Extend selection forward by word |
| `b` | Extend selection backward by word |
| `x` | Extend selection to parent block element |
| `y` | Yank selected text to clipboard and return to Normal mode |
| `Esc` / `v` | Exit selection mode |

### Insert Mode (`INS`)
| Key | Action |
| :--- | :--- |
| `Esc` or `jk` | Exit text input back to Normal mode |

---

## 🛠️ Helix Commands (`:`)

- `:open <url|search|!bang query>` (or `:o`) - Open URL, search query, or search bang
  - e.g. `:open !gh helix-editor`, `:open !so typescript generics`, `:open !npm vite`
- `:tabnew [url]` (or `:t`) - Open new tab
- `:buffer <tab index|query|#>` (or `:b`) - Switch tab (`:b #` for alternate tab)
- `:close` (or `:q`) - Close current tab
- `:only` - Close all other tabs in window
- `:pin` - Toggle tab pin state
- `:mute` - Toggle tab audio muting
- `:split` (or `:vsplit`) - Tile browser window side-by-side
- `:zen` (or `:reader`) - Toggle distraction-free Zen Reader mode
- `:curl` - Yank `curl` command for current URL
- `:markdown` (or `:md`) - Yank selection or page as clean Markdown
- `:table` - Yank nearest table as TSV format
- `:git` - Yank Git clone URL
- `:reload` (or `:r`) - Reload current page
- `:hardreload` - Reload page bypassing cache
- `:theme <theme_name>` - Switch theme (`helix_dark`, `catppuccin_mocha`)
- `:duplicate` - Duplicate current tab
- `:settings` (or `:options`) - Open Settings page

---

## 🛠️ Development & Contributing

This simple extension was written out of my own need after completely changing from Vim to Helix
for a useful Helix-like browser extension.

Contributions are welcome! Please ensure all code changes maintain:
- Zero external build tooling requirements (must run directly as native vanilla HTML/CSS/JS).
- Manifest V3 compatibility and strict Content Security Policy (no inline `eval` or remote scripts).