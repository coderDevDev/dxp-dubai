# Quick Reference - Centralized Architecture

## 📚 Module APIs

### DataLoader (`data-loader.js`)

```javascript
// Fetch data
await window.DataLoader.fetchProjects()   // Returns array of projects
await window.DataLoader.fetchAbout()      // Returns about page data
await window.DataLoader.fetchContact()    // Returns contact page data
await window.DataLoader.fetchHeader()     // Returns header config

// Cache management
window.DataLoader.clearCache()            // Clear all cached data
window.DataLoader.config                  // Access API configuration

// Legacy aliases (still work)
await window.fetchProjects()
await window.fetchAbout()
await window.fetchContact()
await window.fetchHeader()
```

### PageRenderer (`page-renderer.js`)

```javascript
// Render functions
window.PageRenderer.renderIndexProjects(projects)      // Homepage grid (#works)
window.PageRenderer.renderWorksProjects(projects)      // Works page (#works-list-project)
window.PageRenderer.renderHomepageSlider(projects)     // Homepage slider
window.PageRenderer.renderAboutContent(pageData)       // About page (.box--about)
window.PageRenderer.renderContactContent(pageData)     // Contact page (.list--staff)
window.PageRenderer.renderProjectDetail(project)       // Project detail page
window.PageRenderer.initializePage()                   // Auto-detect and render
```

### AppInit (`app-init.js`)

```javascript
// Load functions
window.AppInit.loadIndexProjects()           // Load homepage content
window.AppInit.loadAboutContent()            // Load about content
window.AppInit.loadContactContent()          // Load contact content

// Check functions
window.AppInit.checkAndLoadIndexProjects()   // Check and load if needed
window.AppInit.checkAndLoadAboutContent()    // Check and load if needed
window.AppInit.checkAndLoadContactContent()  // Check and load if needed

// Cleanup
window.AppInit.cleanup()                     // Clear intervals
```

### SiteConfig (`site-config.js`)

```javascript
// Global load functions (called by routing system)
window.loadIndexProjects()    // Homepage
window.loadProjects()         // Works page
window.loadAboutContent()     // About page
window.loadContactContent()   // Contact page

// Utility
window.reloadSiteConfig()     // Reload configuration
```

---

## 🗂️ Container IDs by Page

| Page | Container ID/Class | Renderer Function |
|------|-------------------|-------------------|
| Homepage (index.html) | `#works` | `renderIndexProjects()` |
| Homepage Slider | `#homepage-slider` | `renderHomepageSlider()` |
| Works Page (works.html) | `#works-list-project` | `renderWorksProjects()` |
| About Page (about.html) | `.box--about` | `renderAboutContent()` |
| Contact Page (contact.html) | `.list--staff`, `.box--address` | `renderContactContent()` |
| Project Detail | `#project-title`, `#project-video` | `renderProjectDetail()` |

---

## 📋 Script Loading Order

**All HTML pages must load scripts in this exact order:**

```html
<script src="assets/dist/build.min.js"></script>
<script src="assets/js/data-loader.js"></script>
<script src="assets/js/page-renderer.js"></script>
<script src="assets/js/app-init.js"></script>
<script src="assets/js/site-config.js"></script>
```

---

## 🔄 Data Flow Patterns

### Pattern 1: Load and Render (Homepage)
```javascript
const projects = await window.fetchProjects();
window.PageRenderer.renderIndexProjects(projects);
window.PageRenderer.renderHomepageSlider(projects);
```

### Pattern 2: Load and Render (Works Page)
```javascript
const projects = await window.fetchProjects();
window.PageRenderer.renderWorksProjects(projects);
```

### Pattern 3: Load and Render (About)
```javascript
const data = await window.fetchAbout();
window.PageRenderer.renderAboutContent(data.page);
```

### Pattern 4: Load and Render (Contact)
```javascript
const data = await window.fetchContact();
window.PageRenderer.renderContactContent(data.page);
```

### Pattern 5: Load and Render (Project Detail)
```javascript
const projects = await window.fetchProjects();
const project = projects.find(p => p.id == projectId);
window.PageRenderer.renderProjectDetail(project);
```

---

## 🎯 Common Tasks

### Add New Data Source

1. **Add to `data-loader.js`:**
```javascript
async function fetchNewData() {
  return await fetchData('newdata', 'data/newdata.json');
}

window.DataLoader.fetchNewData = fetchNewData;
window.fetchNewData = fetchNewData;
```

2. **Add renderer to `page-renderer.js`:**
```javascript
function renderNewData(data) {
  const container = document.getElementById('new-container');
  container.innerHTML = data.content;
}

const PageRenderer = {
  // ... existing
  renderNewData
};
```

3. **Add loader to `site-config.js`:**
```javascript
window.loadNewData = async function() {
  const data = await window.fetchNewData();
  window.PageRenderer.renderNewData(data);
}
```

### Toggle Between API and JSON

Edit `data-loader.js`:
```javascript
const API_CONFIG = {
  USE_CMS_API: false,  // Change to false for local JSON only
  // ...
};
```

### Clear Cache Manually

```javascript
// In browser console
window.DataLoader.clearCache();
```

### Force Reload Page Content

```javascript
// In browser console
window.DataLoader.clearCache();
window.loadIndexProjects();  // or any load function
```

### Debug Cache Contents

```javascript
// In browser console
console.log(window.DataLoader);
// Look for cache object in the output
```

---

## 🐛 Quick Debug Commands

### Check if modules loaded
```javascript
console.log('DataLoader:', typeof window.DataLoader);
console.log('PageRenderer:', typeof window.PageRenderer);
console.log('AppInit:', typeof window.AppInit);
```

### Check current page
```javascript
console.log('Body class:', document.body.className);
console.log('URL path:', window.location.pathname);
```

### Check containers exist
```javascript
console.log('Homepage works:', !!document.getElementById('works'));
console.log('Works list:', !!document.getElementById('works-list-project'));
console.log('About box:', !!document.querySelector('.box--about'));
console.log('Staff list:', !!document.querySelector('.list--staff'));
```

### Test data fetching
```javascript
window.fetchProjects().then(data => console.log('Projects:', data));
window.fetchAbout().then(data => console.log('About:', data));
window.fetchContact().then(data => console.log('Contact:', data));
```

---

## 📊 Cache Behavior

### Cache Persists During:
- ✅ Page navigation (SPA)
- ✅ Browser back/forward
- ✅ Tab switching
- ✅ Window focus/blur

### Cache Clears On:
- ❌ Page reload (F5)
- ❌ Hard refresh (Ctrl+Shift+R)
- ❌ New browser tab
- ❌ Browser restart
- ❌ Manual clear (`clearCache()`)

---

## 🔍 Console Log Patterns

### Success Patterns
```javascript
"✓ DataLoader module initialized"
"✓ PageRenderer module initialized"
"✓ AppInit module initialized"
"✓ Using cached data for: projects"
"✓ Initialized X project videos"
```

### Warning Patterns
```javascript
"⚠ Works list container not found"
"⚠ loadProjects not defined yet"
"⚠ No template class found"
```

### Error Patterns
```javascript
"Error fetching projects: Failed to fetch"
"Error loading projects: [error details]"
"CMS API failed, falling back to local JSON..."
```

---

## 📁 File Structure

```
dubaifinal/
├── assets/js/
│   ├── data-loader.js          ← Data fetching & caching
│   ├── page-renderer.js        ← Rendering logic
│   ├── app-init.js             ← Route detection
│   ├── site-config.js          ← SPA routing (modified)
│   ├── api-config.js           ← DEPRECATED (use data-loader)
│   └── cms-integration.js      ← DEPRECATED
├── data/
│   ├── project.json            ← Projects data
│   ├── about.json              ← About page data
│   ├── contact.json            ← Contact page data
│   └── header.json             ← Header config
├── documentation/
│   ├── centralized-architecture-implementation.md
│   ├── troubleshooting-guide.md
│   ├── quick-reference.md
│   ├── DATA_SHARING_GUIDE.md
│   └── CENTRALIZED_ARCHITECTURE.md
├── index.html                  ← Homepage (no inline scripts)
├── about.html                  ← About page (no inline scripts)
├── contact.html                ← Contact page (no inline scripts)
├── works.html                  ← Works page (no inline scripts)
└── works/
    └── project-detail.html     ← Project detail (minimal inline)
```

---

## 🎯 Best Practices

### DO ✅
- Use centralized modules for all data operations
- Keep scripts in correct loading order
- Test on direct visit AND navigation
- Check console for errors
- Use appropriate renderer for each page
- Clear cache when debugging

### DON'T ❌
- Add inline scripts to HTML files
- Change script loading order
- Mix old and new patterns
- Duplicate rendering logic
- Skip error handling
- Ignore console warnings

---

## 📞 Need Help?

1. Check `troubleshooting-guide.md` for common issues
2. Review `centralized-architecture-implementation.md` for details
3. Check browser console for error messages
4. Verify script loading order
5. Test with cache cleared

---

## 🔗 Related Files

- **Implementation Details:** `centralized-architecture-implementation.md`
- **Troubleshooting:** `troubleshooting-guide.md`
- **Data Sharing:** `DATA_SHARING_GUIDE.md`
- **Architecture:** `CENTRALIZED_ARCHITECTURE.md`
- **Header System:** `header_workflow.md`
