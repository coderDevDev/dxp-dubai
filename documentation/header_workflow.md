# Dynamic Header Configuration System

## 📋 Overview

The dynamic header configuration system allows you to switch between different header layouts and logo styles by changing one line in `data/header.json`. This provides a smooth, flash-free user experience with centralized configuration.

## 🎯 Key Features

- ✅ **Zero FOUC** - Synchronous loading prevents flash of unstyled content
- ✅ **Smooth Transitions** - Logo fades in with correct positioning
- ✅ **Single Source of Truth** - All config in `data/header.json`
- ✅ **Efficient** - Config loaded once, reused by multiple scripts
- ✅ **Comprehensive** - Controls logo, navigation, menu, submenu
- ✅ **Responsive** - Mobile, desktop, and extra-large breakpoints
- ✅ **Easy Switching** - Change one line, refresh browser

## 🔄 Complete Workflow

### Step 1: Configuration (`data/header.json`)

```json
{
  "activePreset": "reversed",
  "presets": {
    "default": { /* Logo left, menu right */ },
    "reversed": { /* Logo right, menu left */ },
    "stackedLogo": { /* Tall stacked logo */ }
  }
}
```

### Step 2: Critical CSS (`index.html` <head>)

```javascript
// Synchronous load prevents FOUC
var xhr = new XMLHttpRequest();
xhr.open('GET', '/data/header.json', false);
xhr.send();

// Inject CSS immediately
var style = document.createElement('style');
style.textContent = generateHeaderCSS(presetConfig);
document.head.appendChild(style);
```

### Step 3: Logo Update (DOM Ready)

```javascript
document.addEventListener('DOMContentLoaded', function() {
  logo.src = presetConfig.logo.src;
  logo.classList.add('loaded'); // Fade in
});
```

### Step 4: Comprehensive Styles (`site-config.js`)

```javascript
if (window.__headerConfig) {
  headerConfig = window.__headerConfig; // Reuse!
}
applyHeaderStyles();
```

## 📊 Data Flow

```
1. Browser loads page
   ↓
2. <head> script loads data/header.json (sync)
   ↓
3. CSS generated and injected
   ↓
4. Page renders (logo hidden, correct position)
   ↓
5. DOM ready → logo src updated → fade in
   ↓
6. site-config.js reuses config → full styles
```

## 🎨 Available Presets

### 1. default
- **Layout:** Logo left, menu right
- **Logo:** `assets/img/version_2/dubaifilmmaker.svg`
- **Mobile:** Logo max-height 80px
- **Desktop:** Logo max-height 80px, full width

### 2. reversed
- **Layout:** Logo right, menu left
- **Logo:** `assets/img/version_1/dubaifilmmaker.svg`
- **Features:** Navigation slides from left, menu items left-aligned
- **Mobile:** Logo max-width 180px
- **Desktop:** Logo auto width

### 3. stackedLogo
- **Layout:** Logo left, menu right
- **Logo:** `assets/img/dubaifilmmaker123.svg`
- **Mobile:** Logo max-height 100px (taller)
- **Desktop:** Logo max-height 80px
- **Extra Large:** Logo max-height 120px

## 🚀 How to Use

### Switch Presets

1. Open `data/header.json`
2. Change `activePreset`:
   ```json
   {
     "activePreset": "reversed"  // or "default" or "stackedLogo"
   }
   ```
3. Refresh browser (Ctrl+Shift+R)

### Create Custom Preset

1. Add to `data/header.json`:
   ```json
   "myCustom": {
     "name": "My Custom Layout",
     "logo": { "src": "assets/img/my-logo.svg" },
     "mobile": { /* styles */ },
     "desktop": { /* styles */ },
     "extraLarge": { /* styles */ }
   }
   ```
2. Activate: `"activePreset": "myCustom"`
3. Refresh browser

## 🐛 Troubleshooting

### Logo not changing?
- Check logo path in `data/header.json`
- Verify file exists
- Clear browser cache (Ctrl+Shift+R)
- Check console for errors

### Styles not applying?
- Validate JSON syntax ([JSONLint](https://jsonlint.com/))
- Check console for: `✓ Critical header CSS loaded synchronously`
- Inspect element to verify styles

### Logo flashing?
- Verify critical CSS script in `<head>`
- Check `.header__logo` has `opacity: 0` initially
- Verify `.loaded` class is added

## 📁 File Structure

```
dubaifinal/
├── data/
│   └── header.json              # Configuration
├── assets/
│   ├── js/
│   │   └── site-config.js       # Comprehensive styles
│   └── img/
│       ├── version_1/           # Logo version 1
│       ├── version_2/           # Logo version 2
│       └── dubaifilmmaker123.svg
├── index.html                   # Critical CSS injection
├── works.html
├── about.html
└── contact.html
```

## ✨ Benefits

**Before:**
```
Load → Wrong logo → JS loads → Logo jumps
     ❌ FLASH      ❌ JUMP
```

**After:**
```
Load → Correct position → Logo fades in
     ✅ NO FLASH   ✅ SMOOTH
```

## 🔧 Technical Details

### Why Synchronous XHR?
- Loads tiny JSON file (~5-10KB)
- Happens in microseconds
- Prevents FOUC (worth tiny delay)
- Only blocks `<head>`, not entire page

### CSS Specificity
```css
html body .app-container .header .header__nav { }
```
High specificity ensures our styles override base CSS.

### Transition Timing
```css
.header__logo {
  transition: opacity 0.15s ease-in;
}
```
Fast enough to feel instant, slow enough to be smooth.

## 📚 Related Files

- `data/header.json` - Configuration
- `index.html` - Critical CSS injection
- `assets/js/site-config.js` - Comprehensive styles
- `CONFIG_USAGE.md` - General configuration guide

---

**Last Updated:** November 2025  
**System Version:** 1.0