/**
 * Centralized App Initializer
 * Single source of truth for app initialization and routing
 * Handles page-specific logic and route changes
 */

(function() {
  'use strict';

  let lastPath = window.location.pathname;
  let checkInterval = null;

  function checkAndLoadIndexProjects() {
    const worksContainer = document.getElementById('works');
    if (worksContainer && worksContainer.children.length === 0) {
      console.log('Loading index projects...');
      loadIndexProjects();
    }
  }

  function checkAndLoadAboutContent() {
    const aboutBox = document.querySelector('.box--about');
    if (aboutBox && aboutBox.textContent.includes('Loading')) {
      console.log('Loading about content...');
      loadAboutContent();
    }
  }

  function checkAndLoadContactContent() {
    const staffList = document.querySelector('.list--staff');
    if (staffList && staffList.textContent.includes('Loading')) {
      console.log('Loading contact content...');
      loadContactContent();
    }
  }

  async function loadIndexProjects() {
    try {
      console.log('Loading projects for index page...');
      const projects = await window.fetchProjects();
      window.PageRenderer.renderIndexProjects(projects);
      window.PageRenderer.renderHomepageSlider(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  async function loadAboutContent() {
    try {
      console.log('Loading about page content...');
      const data = await window.fetchAbout();
      window.PageRenderer.renderAboutContent(data.page);
    } catch (error) {
      console.error('Error loading about content:', error);
    }
  }

  async function loadContactContent() {
    try {
      console.log('Loading contact page content...');
      const data = await window.fetchContact();
      window.PageRenderer.renderContactContent(data.page);
    } catch (error) {
      console.error('Error loading contact content:', error);
    }
  }

  function handleRouteChange() {
    const currentPath = window.location.pathname;
    
    if (currentPath !== lastPath) {
      console.log('Route changed from', lastPath, 'to', currentPath);
      lastPath = currentPath;

      setTimeout(function() {
        if (currentPath.includes('/works')) {
          console.log('Works page detected');
        } else if (currentPath === '/' || currentPath.includes('index')) {
          checkAndLoadIndexProjects();
        } else if (currentPath.includes('/about')) {
          checkAndLoadAboutContent();
        } else if (currentPath.includes('/contact')) {
          checkAndLoadContactContent();
        }
      }, 200);
    }
  }

  function initializeCurrentPage() {
    // Skip if site-config.js already loaded initial page
    if (window.__initialPageLoaded) {
      console.log('⏸ Initial page already loaded by site-config.js, skipping app-init');
      return;
    }
    
    const pathname = window.location.pathname;
    
    if (pathname === '/' || pathname.includes('index')) {
      checkAndLoadIndexProjects();
    } else if (pathname.includes('/about')) {
      checkAndLoadAboutContent();
    } else if (pathname.includes('/contact')) {
      checkAndLoadContactContent();
    }
  }

  function setupEventListeners() {
    document.addEventListener('DOMContentLoaded', function() {
      // Wait a bit for site-config.js to set the flag
      setTimeout(initializeCurrentPage, 200);
    });

    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        setTimeout(initializeCurrentPage, 100);
      }
    });

    window.addEventListener('focus', function() {
      setTimeout(initializeCurrentPage, 100);
    });

    checkInterval = setInterval(handleRouteChange, 100);
  }

  function cleanup() {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
  }

  window.AppInit = {
    loadIndexProjects,
    loadAboutContent,
    loadContactContent,
    checkAndLoadIndexProjects,
    checkAndLoadAboutContent,
    checkAndLoadContactContent,
    cleanup
  };

  setupEventListeners();
  console.log('✓ AppInit module initialized');
})();
