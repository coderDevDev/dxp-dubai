# Troubleshooting Guide - Centralized Architecture

## 📋 Common Issues and Solutions

This guide covers common issues you might encounter with the centralized architecture and how to resolve them.

---

## 🔍 Issue 1: Page Content Not Rendering

### Symptoms
- Blank page or empty containers
- Console shows data loaded but nothing displays
- "Container not found" warnings

### Possible Causes & Solutions

#### A. Wrong Container ID
**Problem:** Renderer is targeting wrong container ID

**Check:**
```javascript
// Homepage uses #works
document.getElementById('works')

// Works page uses #works-list-project  
document.getElementById('works-list-project')

// About page uses .box--about
document.querySelector('.box--about')

// Contact page uses .list--staff and .box--address
document.querySelector('.list--staff')
document.querySelector('.box--address')
```

**Solution:** Verify you're using the correct renderer for each page:
- Homepage → `renderIndexProjects()`
- Works page → `renderWorksProjects()`
- About page → `renderAboutContent()`
- Contact page → `renderContactContent()`

#### B. Scripts Loading in Wrong Order
**Problem:** Modules not available when needed

**Check:** Script loading order in HTML:
```html
<!-- CORRECT ORDER -->
<script src="assets/dist/build.min.js"></script>
<script src="assets/js/data-loader.js"></script>      <!-- 1st -->
<script src="assets/js/page-renderer.js"></script>    <!-- 2nd -->
<script src="assets/js/app-init.js"></script>         <!-- 3rd -->
<script src="assets/js/site-config.js"></script>      <!-- 4th -->
```

**Solution:** Ensure scripts load in correct order on all pages

#### C. Initial Page Load Not Triggered
**Problem:** Direct visits or reloads don't render content

**Check:** `site-config.js` has initial page loading:
```javascript
if (initialSlug === 'works') {
  setTimeout(() => {
    if (typeof window.loadProjects === 'function') {
      window.loadProjects();
    }
  }, 100);
}
```

**Solution:** Verify initial page loading code exists in `site-config.js` (lines 1230-1254)

---

## 🔍 Issue 2: Data Not Loading

### Symptoms
- Console errors about fetch failures
- "Error loading projects/about/contact" messages
- Empty data returned

### Possible Causes & Solutions

#### A. CMS API Not Running
**Problem:** API endpoint not accessible

**Check Console:**
```javascript
"Fetching projects from: http://localhost:3001/api/projects"
"Error fetching projects: Failed to fetch"
"CMS API failed, falling back to local JSON..."
```

**Solution:**
1. Start your CMS backend server:
   ```bash
   cd [cms-directory]
   npm start
   ```
2. Or disable CMS API in `data-loader.js`:
   ```javascript
   const API_CONFIG = {
     USE_CMS_API: false,  // Use local JSON only
     // ...
   }
   ```

#### B. JSON Files Missing
**Problem:** Local JSON files don't exist

**Check:** Verify these files exist:
- `data/project.json`
- `data/about.json`
- `data/contact.json`
- `data/header.json`

**Solution:** Ensure all JSON files are present with valid data

#### C. CORS Issues
**Problem:** Browser blocking API requests

**Check Console:**
```javascript
"Access to fetch at 'http://localhost:3001/api/projects' 
from origin 'http://localhost:3000' has been blocked by CORS policy"
```

**Solution:** Configure CORS on your backend server

---

## 🔍 Issue 3: Duplicate Content Loading

### Symptoms
- Console shows repeated "Loading projects..." messages
- Multiple intervals running
- Performance issues

### Possible Causes & Solutions

#### A. Inline Scripts Not Removed
**Problem:** HTML files still have old inline scripts

**Check:** Search HTML files for:
```javascript
<script>
  async function loadProjects() { ... }
  setInterval(...);
</script>
```

**Solution:** Remove all inline scripts, use centralized modules only

#### B. Multiple Intervals Running
**Problem:** Both `app-init.js` and inline scripts running

**Check Console:** Look for repeated logs every 100ms or 1000ms

**Solution:** 
1. Remove inline scripts from HTML
2. Keep only centralized modules
3. Reload page to clear old intervals

---

## 🔍 Issue 4: Cache Not Working

### Symptoms
- API called on every navigation
- "Using cached data" never appears in console
- Slow navigation between pages

### Possible Causes & Solutions

#### A. Cache Cleared on Navigation
**Problem:** Something is clearing the cache

**Check:** Look for `clearCache()` calls:
```javascript
window.DataLoader.clearCache();
```

**Solution:** Remove unnecessary `clearCache()` calls

#### B. Different Data Keys
**Problem:** Cache keys don't match

**Check:** Verify consistent endpoint names:
```javascript
// data-loader.js
cache['projects']  // Key used
cache['about']
cache['contact']

// Fetching
fetchData('projects', ...)  // Must match key
```

**Solution:** Ensure consistent cache key naming

---

## 🔍 Issue 5: Works Page Shows Homepage Data

### Symptoms
- Works page displays projects in wrong layout
- Projects render to wrong container
- Styling looks incorrect

### Possible Causes & Solutions

#### A. Wrong Renderer Called
**Problem:** `renderIndexProjects()` called instead of `renderWorksProjects()`

**Check:** `site-config.js` line 1007-1015:
```javascript
window.loadProjects = async function() {
  const projects = await window.fetchProjects();
  window.PageRenderer.renderWorksProjects(projects);  // Must be renderWorksProjects!
}
```

**Solution:** Verify correct renderer is called

#### B. Container ID Conflict
**Problem:** Both pages trying to use same container

**Check:**
- Homepage: `#works`
- Works page: `#works-list-project`

**Solution:** Ensure each page has unique container ID

---

## 🔍 Issue 6: Project Detail Page Not Loading

### Symptoms
- "Project not found" message
- Empty project detail page
- Console shows no project ID

### Possible Causes & Solutions

#### A. Missing Project ID in URL
**Problem:** URL doesn't have `#id=X` parameter

**Check URL:**
```
✓ Correct: /works/project-detail.html#id=1
✗ Wrong:   /works/project-detail.html
```

**Solution:** Ensure links include project ID:
```javascript
<a href="works/project-detail.html#id=${project.id}">
```

#### B. Projects Not Cached
**Problem:** Project detail loads before projects data

**Check Console:**
```javascript
"Loading project with ID: 1"
"Fetching projects from: ..."  // Should use cache
```

**Solution:** Visit homepage or works page first to cache projects data

---

## 🔍 Issue 7: Navigation Not Working

### Symptoms
- Clicking links doesn't navigate
- Page doesn't change
- Console shows no navigation events

### Possible Causes & Solutions

#### A. SPA Router Conflict
**Problem:** Multiple routers interfering

**Check:** Look for conflicting navigation handlers

**Solution:** Ensure only `site-config.js` handles SPA routing

#### B. Event Listeners Not Set Up
**Problem:** Navigation events not captured

**Check Console:**
```javascript
"🔧 Setting up SPA navigation with header sync..."
"✓ MutationObserver started"
```

**Solution:** Verify `site-config.js` is loaded and initialized

---

## 🛠️ Debugging Tools

### Check Module Availability
```javascript
// In browser console
console.log(window.DataLoader);      // Should show object with methods
console.log(window.PageRenderer);    // Should show object with methods
console.log(window.AppInit);         // Should show object with methods
```

### Check Cache Contents
```javascript
// In browser console
console.log(window.DataLoader);
// Look for cache object in output
```

### Force Reload Data
```javascript
// In browser console
window.DataLoader.clearCache();
window.loadIndexProjects();  // or loadProjects(), loadAboutContent(), etc.
```

### Check Current Page Detection
```javascript
// In browser console
console.log(document.body.className);  // Should show template-* class
console.log(window.location.pathname); // Current path
```

---

## 📊 Console Log Reference

### Normal Operation Logs

#### Homepage Load
```javascript
"✓ DataLoader module initialized"
"✓ PageRenderer module initialized"
"✓ AppInit module initialized"
"✓ Initial page detected from body class: homepage"
"📦 Loading initial page content for: homepage"
"✅ Calling loadIndexProjects() for initial page load"
"Loading projects for index page..."
"Fetching projects from: http://localhost:3001/api/projects"
"Rendering projects for index page..."
"✓ Initialized 16 project videos for hover playback"
```

#### Works Page Load
```javascript
"✓ Initial page detected from body class: works"
"📦 Loading initial page content for: works"
"✅ Calling loadProjects() for initial page load"
"Loading projects for works page..."
"✓ Using cached data for: projects"  // If already cached
"Rendering projects for works page..."
"✓ Initialized 16 project videos for works page"
```

#### Navigation (SPA)
```javascript
"👁 Click detected on: <a data-navigo...>"
"🎯 Navigation link found - slug: about href: about"
"✅ Target page set: about"
"📡 MutationObserver triggered, mutations: 1"
"🔍 DOM changed, checking if content loaded for: about"
"✓ Content loaded for: about"
"✅ Calling loadAboutContent()"
"Loading about page content..."
"Fetching about from: http://localhost:3001/api/about"
```

### Error Logs

#### API Failure (with fallback)
```javascript
"Fetching projects from: http://localhost:3001/api/projects"
"Error fetching projects: Failed to fetch"
"CMS API failed, falling back to local JSON..."
"Fetching projects from: data/project.json"
"✓ Projects loaded from fallback"
```

#### Missing Container
```javascript
"Rendering projects for works page..."
"⚠ Works list container not found"
```

#### Module Not Available
```javascript
"⚠ loadProjects not defined yet"
"⚠ PageRenderer not available"
```

---

## 🔧 Quick Fixes Checklist

When something isn't working, check these in order:

1. ✅ **Scripts loaded in correct order**
   - data-loader → page-renderer → app-init → site-config

2. ✅ **All modules initialized**
   - Check console for "✓ [Module] initialized" messages

3. ✅ **Correct renderer for each page**
   - Homepage: `renderIndexProjects()`
   - Works: `renderWorksProjects()`
   - About: `renderAboutContent()`
   - Contact: `renderContactContent()`

4. ✅ **Container IDs match**
   - Homepage: `#works`
   - Works: `#works-list-project`
   - About: `.box--about`
   - Contact: `.list--staff`, `.box--address`

5. ✅ **No inline scripts in HTML**
   - Remove all `<script>` tags with inline code

6. ✅ **Initial page loading enabled**
   - Check `site-config.js` lines 1230-1254

7. ✅ **CMS API running or fallback enabled**
   - Start backend or set `USE_CMS_API: false`

8. ✅ **JSON files exist**
   - Verify all files in `data/` directory

---

## 📞 Getting Help

If issues persist after trying these solutions:

1. **Check Browser Console** - Look for error messages
2. **Check Network Tab** - Verify API/JSON requests
3. **Clear Browser Cache** - Hard refresh (Ctrl+Shift+R)
4. **Check File Paths** - Ensure all paths are correct
5. **Review Recent Changes** - Compare with working version

---

## 🎯 Prevention Tips

To avoid issues in the future:

1. **Never add inline scripts** - Always use centralized modules
2. **Test on direct visit** - Don't just test SPA navigation
3. **Test on reload** - Ensure pages work after refresh
4. **Check all pages** - Test index, works, about, contact, detail
5. **Monitor console** - Watch for warnings and errors
6. **Use correct renderer** - Match page type to renderer function
7. **Keep scripts in order** - Don't change loading sequence

---

## 📚 Related Documentation

- `centralized-architecture-implementation.md` - Full implementation details
- `DATA_SHARING_GUIDE.md` - Data caching and sharing
- `CENTRALIZED_ARCHITECTURE.md` - Architecture overview
