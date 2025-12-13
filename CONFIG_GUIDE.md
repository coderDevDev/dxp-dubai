# Site Configuration Guide

This guide explains how to toggle features on/off for client presentations or demos, and how to switch between different site content.

## Quick Start

1. Open `config.json` in the root directory
2. Change settings as needed
3. Save the file
4. Refresh your browser

## Configuration File: `config.json`

### Site Mode (Content Switcher)

```json
"site": {
  "mode": "dubaifilmmaker"
}
```

**Options**: 
- `"dubaifilmmaker"` - Load Dubai Film Maker projects
- `"posterco"` - Load Poster.co projects

This dynamically changes which projects appear in the projects listing section. Edit `projects-data.json` to customize project data for each site.

**Current**: `dubaifilmmaker`

---

### Demo Mode (Quick Toggle)

```json
"demo": {
  "mode": true
}
```

**Current Setting**: Demo mode is ON (most features disabled for client presentation)

---

## Feature Toggles

### 1. Intro Animation
```json
"introAnimation": {
  "enabled": false
}
```
- `false` = Hide the intro animation completely
- `true` = Show the intro animation

**Current**: DISABLED (hidden)

---

### 2. Navigation Links

#### Works Page
```json
"worksPage": {
  "enabled": false
}
```
- `false` = "Works" link is disabled
- `true` = "Works" link is clickable

**Current**: DISABLED

#### About Page
```json
"aboutPage": {
  "enabled": false
}
```
- `false` = "About" link is disabled
- `true` = "About" link is clickable

**Current**: DISABLED

#### Contact Page
```json
"contactPage": {
  "enabled": false
}
```
- `false` = "Contact" link is disabled
- `true` = "Contact" link is clickable

**Current**: DISABLED

---

### 3. Projects Navigation (Category Filters)
```json
"projectsNav": {
  "enabled": false
}
```
- `false` = Hide category filters (Featured film, Commercials, Music videos)
- `true` = Show category filters

**Current**: DISABLED (hidden)

---

### 4. Home Box Video Links

#### Desktop Video Click
```json
"videoClickable": {
  "enabled": false
}
```
- `false` = Clicking videos won't open project pages
- `true` = Videos are clickable and open project pages

**Current**: DISABLED

#### Mobile "View Project" Button
```json
"mobileViewProject": {
  "enabled": false
}
```
- `false` = "view project" button is disabled on mobile
- `true` = "view project" button works on mobile

**Current**: DISABLED

---

### 5. Projects Listing Links
```json
"clickable": {
  "enabled": false
}
```
- `false` = Project items in listing are not clickable
- `true` = Project items are clickable

**Current**: DISABLED

---

## How to Switch Between Modes

### For Client Presentation (Limited Demo)
Set everything to `false`:

```json
{
  "features": {
    "introAnimation": { "enabled": false },
    "navigation": {
      "worksPage": { "enabled": false },
      "aboutPage": { "enabled": false },
      "contactPage": { "enabled": false }
    },
    "projectsNav": { "enabled": false },
    "homeBoxLinks": {
      "videoClickable": { "enabled": false },
      "mobileViewProject": { "enabled": false }
    },
    "projectsListing": {
      "clickable": { "enabled": false }
    }
  }
}
```

### For Full Website (All Features)
Set everything to `true`:

```json
{
  "features": {
    "introAnimation": { "enabled": true },
    "navigation": {
      "worksPage": { "enabled": true },
      "aboutPage": { "enabled": true },
      "contactPage": { "enabled": true }
    },
    "projectsNav": { "enabled": true },
    "homeBoxLinks": {
      "videoClickable": { "enabled": true },
      "mobileViewProject": { "enabled": true }
    },
    "projectsListing": {
      "clickable": { "enabled": true }
    }
  }
}
```

---

## Testing Your Changes

1. Open browser console (F12)
2. Look for config messages:
   - `✓ Site config loaded` - Config loaded successfully
   - `🎨 DEMO MODE` - Demo mode is active
   - `✓ FULL MODE` - All features enabled

3. To reload config without refreshing page, run in console:
   ```javascript
   window.reloadSiteConfig()
   ```

---

## Troubleshooting

### Config not loading?
- Make sure `config.json` is in the root directory (same level as `index.html`)
- Check browser console for errors
- Verify JSON syntax is correct (no trailing commas, proper quotes)

### Changes not applying?
- Hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Check console for errors

### How to validate JSON?
- Use [JSONLint](https://jsonlint.com/) to check for syntax errors
- Most code editors will highlight JSON errors

---

## File Structure

```
posterco.tv/
├── config.json              ← Edit this to toggle features
├── projects-data.json       ← Edit this to change project content
├── CONFIG_GUIDE.md          ← This guide
├── index.html               ← Main HTML (includes site-config.js)
└── assets/
    └── js/
        └── site-config.js   ← Feature toggle logic (don't edit)
```

---

## Editing Project Data

### File: `projects-data.json`

This file contains the project data for both sites. Structure:

```json
{
  "dubaifilmmaker": {
    "projects": [ /* array of project objects */ ]
  },
  "posterco": {
    "projects": [ /* array of project objects */ ]
  }
}
```

### Project Object Structure

```json
{
  "title": "Project Title",
  "director": "Director Name",
  "category": "Commercials",
  "slug": "project-slug",
  "dataCat": "commercials",
  "posterImage": "https://example.com/image.jpg",
  "posterImageSrcset": "https://example.com/image-300.jpg 300w, https://example.com/image-800.jpg 800w",
  "videoUrl": "https://example.com/video.mp4"
}
```

### Available Categories (dataCat)
- `commercials`
- `music-videos`
- `featured-film`

### How to Add a New Project

1. Open `projects-data.json`
2. Find the site section (`dubaifilmmaker` or `posterco`)
3. Add a new object to the `projects` array
4. Fill in all required fields
5. Save and refresh the page

---

## Quick Reference Table

| Feature | Config Key | Default | Effect When Disabled |
|---------|-----------|---------|---------------------|
| Intro Animation | `introAnimation.enabled` | false | Hidden completely |
| Works Link | `navigation.worksPage.enabled` | false | Not clickable |
| About Link | `navigation.aboutPage.enabled` | false | Not clickable |
| Contact Link | `navigation.contactPage.enabled` | false | Not clickable |
| Category Filters | `projectsNav.enabled` | false | Hidden completely |
| Home Video Clicks | `homeBoxLinks.videoClickable.enabled` | false | Videos not clickable |
| Mobile View Button | `homeBoxLinks.mobileViewProject.enabled` | false | Button disabled |
| Project List Clicks | `projectsListing.clickable.enabled` | false | Projects not clickable |
