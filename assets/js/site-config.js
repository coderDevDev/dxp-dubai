/**
 * Site Configuration Loader
 * Reads config.json and applies feature toggles dynamically
 */

(function () {
  'use strict';

  let config = null;
  let projectsData = null;
  let headerConfig = null;

  const DEBUG_LOGS = false;

  // Load header configuration
  async function loadHeaderConfig() {
    // Check if config was already loaded synchronously in the head
    if (window.__headerConfig) {
      headerConfig = window.__headerConfig;
      console.log('✓ Header config already loaded (from critical CSS)');
      return;
    }
    
    try {
      const response = await fetch('/data/header.json');
      if (!response.ok) {
        throw new Error('Header config file not found');
      }
      headerConfig = await response.json();
      console.log('✓ Header config loaded from data/header.json');
    } catch (error) {
      console.warn('⚠ Could not load data/header.json, using defaults:', error);
      // Use default header config if file not found
      headerConfig = {
        activePreset: 'default',
        presets: {
          default: {
            name: 'Default Layout',
            logo: { src: 'assets/img/dubaifilmmaker.svg' },
            mobile: {
              headerNav: { alignItems: 'center', padding: '0px 0', minHeight: '40px', flexDirection: 'row' },
              logoLink: { maxWidth: 'calc(100% - 100px)', flex: '1' },
              logo: { maxHeight: '80px', maxWidth: '100%', width: 'auto' }
            },
            desktop: { logo: { maxHeight: '80px', width: '100%' } },
            extraLarge: { logo: { maxHeight: '100px' } }
          }
        }
      };
    }
  }

  // Load projects data
  async function loadProjectsData() {
    try {
      const response = await fetch('/projects-data.json');
      if (!response.ok) {
        throw new Error('Projects data file not found');
      }
      projectsData = await response.json();
      console.log('✓ Projects data loaded');
    } catch (error) {
      console.warn('⚠ Could not load projects-data.json:', error);
    }
  }

  // Load configuration
  async function loadConfig() {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error('Config file not found');
      }
      config = await response.json();
      console.log('✓ Site config loaded:', config);
      await loadHeaderConfig();
      await loadProjectsData();
      applyConfig();
    } catch (error) {
      console.warn('⚠ Could not load config.json, using defaults:', error);
      // Use default config if file not found
      config = {
        features: {
          introAnimation: { enabled: true },
          navigation: {
            worksPage: { enabled: true },
            aboutPage: { enabled: true },
            contactPage: { enabled: true }
          },
          projectsNav: { enabled: true },
          homeBoxLinks: {
            videoClickable: { enabled: true },
            mobileViewProject: { enabled: true }
          },
          projectsListing: {
            clickable: { enabled: true }
          }
        },
        demo: { mode: false }
      };
      applyConfig();
    }
  }

  // Update existing project item - preserves event handlers
  function updateProjectItem(listItem, project) {
    // Update data-cat attribute
    listItem.setAttribute('data-cat', project.dataCat);

    const link = listItem.querySelector('a.box--work__link');
    if (link) {
      // Update href
      link.setAttribute('href', `works/${project.slug}`);

      // Update text content
      const infoH2 = link.querySelector('.box--work__info h2');
      const infoPs = link.querySelectorAll('.box--work__info p');
      if (infoH2) infoH2.textContent = project.title;
      if (infoPs[0]) infoPs[0].textContent = project.director;
      if (infoPs[1]) infoPs[1].textContent = project.category;

      // Update image
      const img = link.querySelector('img.video-img-poster');
      if (img) {
        img.setAttribute('data-src', project.posterImage);
        img.setAttribute('data-srcset', project.posterImageSrcset);
        // Trigger lazy load update
        img.removeAttribute('src');
        img.removeAttribute('srcset');
      }

      // Update video
      const video = link.querySelector('video.js-video');
      if (video) {
        video.setAttribute('data-src', project.videoUrl);
        // Reset video
        video.removeAttribute('src');
        video.load();
      }

      // Update cursor text
      const cursorH2 = link.querySelector('.cursor-main-text h2');
      const cursorPs = link.querySelectorAll('.cursor-main-text p');
      if (cursorH2) cursorH2.textContent = project.title;
      if (cursorPs[0]) cursorPs[0].textContent = project.director;
      if (cursorPs[1]) cursorPs[1].textContent = project.category;
    }
  }

  // Create new project item
  function createProjectItem(project) {
    const li = document.createElement('li');
    li.className = 'box box--work';
    li.setAttribute('data-cat', project.dataCat);

    li.innerHTML = `
                    <a
                      href="works/${project.slug}"
                      data-navigo
                      class="box--work__link js-has-cursor-text"
                    >
                      <div class="box--work__info">
                        <h2>${project.title}</h2>
                        <p>${project.director}</p>
                        <p>${project.category}</p>
                      </div>

                      <div class="box--work__video video-wrapper has-poster">
                        <img
                          class="video-img-poster lazy-media"
                          data-src="${project.posterImage}"
                          data-srcset="${project.posterImageSrcset}"
                          alt=""
                        />
                        <video
                          class="js-video lazy-media"
                          data-src="${project.videoUrl}"
                          playsinline
                          loop
                          muted
                        ></video>
                      </div>
                      <div class="cursor-text-animated js-cursor-text-animated">
                        <div
                          class="mooving-elements is-arrow"
                          data-friction="1"
                        >
                          <svg
                            width="11"
                            height="10"
                            viewBox="0 0 11 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.72366 3.91174H7.0685L5.14349 3.8482L6.53777 4.99985L8.40882 6.65189L7.19444 7.72412L5.3234 6.07209L4.01007 4.83306L4.07303 6.50892L4.06404 8.02593L2.3819 6.54069L2.39989 2.42649L7.04152 2.42649L8.72366 3.91174Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <div
                          class="mooving-elements shift cursor-main-text"
                          data-friction="5"
                        >
                          <h2>${project.title}</h2>
                          <p>${project.director}</p>
                          <p>${project.category}</p>
                        </div>
                      </div>
                    </a>
`;
    return li;
  }

  // Load site content based on mode (dubaifilmmaker or posterco)
  function loadSiteContent(siteMode) {
    if (!projectsData || !projectsData[siteMode]) {
      console.warn(`⚠ No data found for site mode: ${siteMode}`);
      return;
    }

    const projects = projectsData[siteMode].projects;
    const projectsList = document.querySelector(
      '.bloc-projects-listing .list--works'
    );

    if (!projectsList) {
      console.warn('⚠ Projects list container not found');
      console.log('Available elements:', {
        blocProjectsListing: document.querySelector('.bloc-projects-listing'),
        listWorks: document.querySelector('.list--works'),
        worksId: document.querySelector('#works')
      });
      return;
    }

    console.log(
      `🔄 Updating projects with ${siteMode} content...`,
      projectsList
    );

    // Get existing <li> elements
    const existingItems = Array.from(
      projectsList.querySelectorAll('li.box--work')
    );

    // Update existing items and add new ones if needed
    // projects.forEach((project, index) => {
    //   if (existingItems[index]) {
    //     // Update existing item - preserves event handlers
    //     updateProjectItem(existingItems[index], project);
    //   } else {
    //     // Add new item if we have more projects than existing items
    //     const newItem = createProjectItem(project);
    //     projectsList.appendChild(newItem);
    //   }
    // });

    // // Remove extra items if we have fewer projects
    // if (existingItems.length > projects.length) {
    //   for (let i = projects.length; i < existingItems.length; i++) {
    //     existingItems[i].remove();
    //   }
    // }

    // console.log(`✓ Updated ${projects.length} projects for site: ${siteMode}`);

    // // Trigger lazy loading update for updated images
    // setTimeout(() => {
    //   if (typeof LazyLoad !== 'undefined' && window.lazyLoadInstance) {
    //     window.lazyLoadInstance.update();
    //     console.log('✓ Lazy loading updated for content changes');
    //   }
    // }, 100);
  }

  // Apply header styles from data/header.json
  function applyHeaderStyles() {
    if (!headerConfig) {
      console.warn('⚠ Header config not loaded');
      return;
    }

    const preset = headerConfig.activePreset || 'default';
    const presetConfig = headerConfig.presets?.[preset];

    if (!presetConfig) {
      console.warn(`⚠ Header preset '${preset}' not found, using default`);
      return;
    }

    console.log(`🎨 Applying header preset: ${preset} (${presetConfig.name})`);

    // Update logo source if specified
    if (presetConfig.logo?.src) {
      const logoElements = document.querySelectorAll('.header__logo');
      logoElements.forEach(logo => {
        logo.src = presetConfig.logo.src;
        if (presetConfig.logo.alt) {
          logo.alt = presetConfig.logo.alt;
        }
        // Add 'loaded' class to make logo visible with smooth transition
        logo.classList.add('loaded');
      });
      console.log(`✓ Logo updated to: ${presetConfig.logo.src}`);
    }

    // Inject dynamic CSS for header styles
    injectHeaderCSS(presetConfig);
  }

  // Inject comprehensive navigation styles only (for when critical CSS exists)
  function injectComprehensiveHeaderCSS(presetConfig) {
    const styleId = 'header-comprehensive-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    let css = '';

    // Mobile comprehensive styles (navigation, submenu, menu button states)
    if (presetConfig.mobile) {
      css += `
      @media (max-width: 767px) {
        ${presetConfig.mobile.navigationWrapper ? `
        html body .app-container .header .header__navigations-wrapper {
          ${presetConfig.mobile.navigationWrapper.left ? `left: ${presetConfig.mobile.navigationWrapper.left} !important;` : ''}
          ${presetConfig.mobile.navigationWrapper.right ? `right: ${presetConfig.mobile.navigationWrapper.right} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.subNav ? `
        html body .app-container .header .header__subnav {
          ${presetConfig.mobile.subNav.left ? `left: ${presetConfig.mobile.subNav.left} !important;` : ''}
          ${presetConfig.mobile.subNav.right ? `right: ${presetConfig.mobile.subNav.right} !important;` : ''}
          ${presetConfig.mobile.subNav.textAlign ? `text-align: ${presetConfig.mobile.subNav.textAlign} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.subNavUl ? `
        html body .app-container .header .header__subnav ul {
          ${presetConfig.mobile.subNavUl.alignItems ? `align-items: ${presetConfig.mobile.subNavUl.alignItems} !important;` : ''}
          ${presetConfig.mobile.subNavUl.paddingLeft ? `padding-left: ${presetConfig.mobile.subNavUl.paddingLeft} !important;` : ''}
          ${presetConfig.mobile.subNavUl.paddingRight ? `padding-right: ${presetConfig.mobile.subNavUl.paddingRight} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.subNavLi ? `
        html body .app-container .header .header__subnav li {
          ${presetConfig.mobile.subNavLi.textAlign ? `text-align: ${presetConfig.mobile.subNavLi.textAlign} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.subNavLink ? `
        html body .app-container .header .header__subnav li a {
          ${presetConfig.mobile.subNavLink.justifyContent ? `justify-content: ${presetConfig.mobile.subNavLink.justifyContent} !important;` : ''}
          ${presetConfig.mobile.subNavLink.textAlign ? `text-align: ${presetConfig.mobile.subNavLink.textAlign} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.menuButtonOpen ? `
        html body.header--open .app-container .header .header__nav .btn--menu {
          ${presetConfig.mobile.menuButtonOpen.clipPath ? `clip-path: ${presetConfig.mobile.menuButtonOpen.clipPath} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.menuButtonOpenBefore ? `
        html body.header--open .app-container .header .header__nav .btn--menu:before {
          ${presetConfig.mobile.menuButtonOpenBefore.left ? `left: ${presetConfig.mobile.menuButtonOpenBefore.left} !important;` : ''}
          ${presetConfig.mobile.menuButtonOpenBefore.right ? `right: ${presetConfig.mobile.menuButtonOpenBefore.right} !important;` : ''}
        }
        ` : ''}
      }
      `;
    }

    // Desktop comprehensive styles
    if (presetConfig.desktop) {
      css += `
      @media (min-width: 768px) {
        ${presetConfig.desktop.navigationWrapper ? `
        html body .app-container .header .header__navigations-wrapper {
          ${presetConfig.desktop.navigationWrapper.left ? `left: ${presetConfig.desktop.navigationWrapper.left} !important;` : ''}
          ${presetConfig.desktop.navigationWrapper.right ? `right: ${presetConfig.desktop.navigationWrapper.right} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.desktop.subNav ? `
        html body .app-container .header .header__subnav {
          ${presetConfig.desktop.subNav.left ? `left: ${presetConfig.desktop.subNav.left} !important;` : ''}
          ${presetConfig.desktop.subNav.right ? `right: ${presetConfig.desktop.subNav.right} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.desktop.subNavUl ? `
        html body .app-container .header .header__subnav ul {
          ${presetConfig.desktop.subNavUl.alignItems ? `align-items: ${presetConfig.desktop.subNavUl.alignItems} !important;` : ''}
          ${presetConfig.desktop.subNavUl.paddingLeft ? `padding-left: ${presetConfig.desktop.subNavUl.paddingLeft} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.desktop.subNavLink ? `
        html body .app-container .header .header__subnav li a {
          ${presetConfig.desktop.subNavLink.justifyContent ? `justify-content: ${presetConfig.desktop.subNavLink.justifyContent} !important;` : ''}
          ${presetConfig.desktop.subNavLink.textAlign ? `text-align: ${presetConfig.desktop.subNavLink.textAlign} !important;` : ''}
        }
        ` : ''}
      }
      `;
    }

    styleElement.textContent = css;
    console.log('✓ Comprehensive navigation styles injected');
  }

  // Inject dynamic CSS for header styles
  function injectHeaderCSS(presetConfig) {
    const styleId = 'header-config-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    let css = `
      /* Universal logo styling - works for any logo variation */
      .header__logo {
        object-fit: contain !important;
        height: auto !important;
      }
    `;

    // Mobile styles
    if (presetConfig.mobile) {
      css += `
      /* Mobile header styles */
      @media (max-width: 767px) {
        html body .app-container .header .header__nav {
          display: flex !important;
          align-items: ${presetConfig.mobile.headerNav.alignItems} !important;
          padding: ${presetConfig.mobile.headerNav.padding} !important;
          min-height: ${presetConfig.mobile.headerNav.minHeight} !important;
          ${presetConfig.mobile.headerNav.flexDirection ? `flex-direction: ${presetConfig.mobile.headerNav.flexDirection} !important;` : ''}
          ${presetConfig.mobile.headerNav.justifyContent ? `justify-content: ${presetConfig.mobile.headerNav.justifyContent} !important;` : ''}
          ${presetConfig.mobile.headerNav.gap ? `gap: ${presetConfig.mobile.headerNav.gap} !important;` : ''}
          ${presetConfig.mobile.headerNav.width ? `width: ${presetConfig.mobile.headerNav.width} !important;` : ''}
        }

        html body .app-container .header .header__nav .logo-link {
          display: flex !important;
          align-items: center !important;
          ${presetConfig.mobile.logoLink.maxWidth ? `max-width: ${presetConfig.mobile.logoLink.maxWidth} !important;` : ''}
          ${presetConfig.mobile.logoLink.flex ? `flex: ${presetConfig.mobile.logoLink.flex} !important;` : ''}
          ${presetConfig.mobile.logoLink.flexShrink ? `flex-shrink: ${presetConfig.mobile.logoLink.flexShrink} !important;` : ''}
          ${presetConfig.mobile.logoLink.paddingRight ? `padding-right: ${presetConfig.mobile.logoLink.paddingRight} !important;` : ''}
          ${presetConfig.mobile.logoLink.width ? `width: ${presetConfig.mobile.logoLink.width} !important;` : ''}
          ${presetConfig.mobile.logoLink.margin ? `margin: ${presetConfig.mobile.logoLink.margin} !important;` : ''}
        }

        html body .app-container .header .header__nav .logo-link .header__logo {
          display: block !important;
          max-height: ${presetConfig.mobile.logo.maxHeight} !important;
          max-width: ${presetConfig.mobile.logo.maxWidth} !important;
          width: ${presetConfig.mobile.logo.width} !important;
          ${presetConfig.mobile.logo.margin ? `margin: ${presetConfig.mobile.logo.margin} !important;` : 'margin: 0 !important;'}
        }

        html body .app-container .header .header__nav .btn--menu {
          flex-shrink: 0 !important;
          ${presetConfig.mobile.menuButton ? `
          ${presetConfig.mobile.menuButton.width ? `width: ${presetConfig.mobile.menuButton.width} !important;` : ''}
          ${presetConfig.mobile.menuButton.margin ? `margin: ${presetConfig.mobile.menuButton.margin} !important;` : 'margin: 0 !important;'}
          ${presetConfig.mobile.menuButton.position ? `position: ${presetConfig.mobile.menuButton.position} !important;` : ''}
          ` : 'margin: 0 !important;'}
        }
        
        ${presetConfig.mobile.navigationWrapper ? `
        html body .app-container .header .header__navigations-wrapper {
          ${presetConfig.mobile.navigationWrapper.left ? `left: ${presetConfig.mobile.navigationWrapper.left} !important;` : ''}
          ${presetConfig.mobile.navigationWrapper.right ? `right: ${presetConfig.mobile.navigationWrapper.right} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.subNav ? `
        html body .app-container .header .header__subnav {
          ${presetConfig.mobile.subNav.left ? `left: ${presetConfig.mobile.subNav.left} !important;` : ''}
          ${presetConfig.mobile.subNav.right ? `right: ${presetConfig.mobile.subNav.right} !important;` : ''}
          ${presetConfig.mobile.subNav.textAlign ? `text-align: ${presetConfig.mobile.subNav.textAlign} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.subNavUl ? `
        html body .app-container .header .header__subnav ul {
          ${presetConfig.mobile.subNavUl.alignItems ? `align-items: ${presetConfig.mobile.subNavUl.alignItems} !important;` : ''}
          ${presetConfig.mobile.subNavUl.paddingLeft ? `padding-left: ${presetConfig.mobile.subNavUl.paddingLeft} !important;` : ''}
          ${presetConfig.mobile.subNavUl.paddingRight ? `padding-right: ${presetConfig.mobile.subNavUl.paddingRight} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.subNavLi ? `
        html body .app-container .header .header__subnav li {
          ${presetConfig.mobile.subNavLi.textAlign ? `text-align: ${presetConfig.mobile.subNavLi.textAlign} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.subNavLink ? `
        html body .app-container .header .header__subnav li a {
          ${presetConfig.mobile.subNavLink.justifyContent ? `justify-content: ${presetConfig.mobile.subNavLink.justifyContent} !important;` : ''}
          ${presetConfig.mobile.subNavLink.textAlign ? `text-align: ${presetConfig.mobile.subNavLink.textAlign} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.menuButtonOpen ? `
        html body.header--open .app-container .header .header__nav .btn--menu {
          ${presetConfig.mobile.menuButtonOpen.clipPath ? `clip-path: ${presetConfig.mobile.menuButtonOpen.clipPath} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.mobile.menuButtonOpenBefore ? `
        html body.header--open .app-container .header .header__nav .btn--menu:before {
          ${presetConfig.mobile.menuButtonOpenBefore.left ? `left: ${presetConfig.mobile.menuButtonOpenBefore.left} !important;` : ''}
          ${presetConfig.mobile.menuButtonOpenBefore.right ? `right: ${presetConfig.mobile.menuButtonOpenBefore.right} !important;` : ''}
        }
        ` : ''}
      }
      `;
    }

    // Desktop styles
    if (presetConfig.desktop) {
      css += `
      /* Desktop/Large screen styles */
      @media (min-width: 768px) {
        ${presetConfig.desktop.headerNav ? `
        html body .app-container .header .header__nav {
          display: flex !important;
          ${presetConfig.desktop.headerNav.flexDirection ? `flex-direction: ${presetConfig.desktop.headerNav.flexDirection} !important;` : ''}
          ${presetConfig.desktop.headerNav.justifyContent ? `justify-content: ${presetConfig.desktop.headerNav.justifyContent} !important;` : ''}
          ${presetConfig.desktop.headerNav.gap ? `gap: ${presetConfig.desktop.headerNav.gap} !important;` : ''}
          ${presetConfig.desktop.headerNav.alignItems ? `align-items: ${presetConfig.desktop.headerNav.alignItems} !important;` : ''}
          ${presetConfig.desktop.headerNav.width ? `width: ${presetConfig.desktop.headerNav.width} !important;` : ''}
          ${presetConfig.desktop.headerNav.minHeight ? `min-height: ${presetConfig.desktop.headerNav.minHeight} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.desktop.logoLink ? `
        html body .app-container .header .header__nav .logo-link {
          display: flex !important;
          align-items: center !important;
          ${presetConfig.desktop.logoLink.width ? `width: ${presetConfig.desktop.logoLink.width} !important;` : ''}
          ${presetConfig.desktop.logoLink.flexShrink ? `flex-shrink: ${presetConfig.desktop.logoLink.flexShrink} !important;` : ''}
          ${presetConfig.desktop.logoLink.margin ? `margin: ${presetConfig.desktop.logoLink.margin} !important;` : ''}
        }
        ` : ''}

        html body .app-container .header .header__nav .logo-link .header__logo {
          display: block !important;
          max-height: ${presetConfig.desktop.logo.maxHeight} !important;
          width: ${presetConfig.desktop.logo.width} !important;
          ${presetConfig.desktop.logo.margin ? `margin: ${presetConfig.desktop.logo.margin} !important;` : ''}
        }
        
        ${presetConfig.desktop.navigationWrapper ? `
        html body .app-container .header .header__navigations-wrapper {
          ${presetConfig.desktop.navigationWrapper.left ? `left: ${presetConfig.desktop.navigationWrapper.left} !important;` : ''}
          ${presetConfig.desktop.navigationWrapper.right ? `right: ${presetConfig.desktop.navigationWrapper.right} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.desktop.subNav ? `
        html body .app-container .header .header__subnav {
          ${presetConfig.desktop.subNav.left ? `left: ${presetConfig.desktop.subNav.left} !important;` : ''}
          ${presetConfig.desktop.subNav.right ? `right: ${presetConfig.desktop.subNav.right} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.desktop.subNavUl ? `
        html body .app-container .header .header__subnav ul {
          ${presetConfig.desktop.subNavUl.alignItems ? `align-items: ${presetConfig.desktop.subNavUl.alignItems} !important;` : ''}
          ${presetConfig.desktop.subNavUl.paddingLeft ? `padding-left: ${presetConfig.desktop.subNavUl.paddingLeft} !important;` : ''}
        }
        ` : ''}
        
        ${presetConfig.desktop.subNavLink ? `
        html body .app-container .header .header__subnav li a {
          ${presetConfig.desktop.subNavLink.justifyContent ? `justify-content: ${presetConfig.desktop.subNavLink.justifyContent} !important;` : ''}
          ${presetConfig.desktop.subNavLink.textAlign ? `text-align: ${presetConfig.desktop.subNavLink.textAlign} !important;` : ''}
        }
        ` : ''}
      }
      `;
    }

    // Extra large screen styles
    if (presetConfig.extraLarge) {
      css += `
      /* Extra large screens */
      @media (min-width: 1200px) {
        .header__logo {
          max-height: ${presetConfig.extraLarge.logo.maxHeight} !important;
        }
      }
      `;
    }

    styleElement.textContent = css;
    console.log('✓ Header CSS styles injected');
  }

  // Inject initial CSS to prevent logo flicker
  function injectInitialLogoStyles() {
    const styleId = 'site-config-initial-logo';
    if (document.getElementById(styleId)) return; // Already injected

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Hide logo initially to prevent flicker */
      .header__logo {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      /* Show logo after styles are applied */
      .header__logo.loaded {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
    console.log('✓ Initial logo styles injected');
  }

  // Inject CSS for disabled links
  function injectDisabledLinkStyles() {
    const styleId = 'site-config-disabled-styles';
    if (document.getElementById(styleId)) return; // Already injected

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .disabled-link,
      .disabled-link *,
      .disabled-project,
      .disabled-project * {
        pointer-events: none !important;
        cursor: default !important;
        -webkit-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      .disabled-link,
      .disabled-project {
        opacity: 0.7 !important;
      }
      
      /* Specifically target cursor text animations */
      .disabled-link .js-cursor-text-animated,
      .disabled-project .js-cursor-text-animated,
      .disabled-link .cursor-text-animated,
      .disabled-project .cursor-text-animated {
        display: none !important;
      }
      
      /* Block all interactive classes */
      .disabled-project .js-has-cursor-text,
      .disabled-link.js-has-cursor-text {
        pointer-events: none !important;
        cursor: default !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Apply configuration to the page
  function applyConfig() {
    if (!config) return;

    const features = config.features;

    // Inject CSS styles for disabled links
    injectDisabledLinkStyles();

    // Apply header styles from data/header.json
    applyHeaderStyles();

    // 1. INTRO ANIMATION
    handleIntroAnimation(features.introAnimation.enabled);

    // 2. NAVIGATION LINKS
    handleNavigationLinks(features.navigation);

    // 3. PROJECTS NAVIGATION (Category filters)
    handleProjectsNav(features.projectsNav.enabled);

    // 4. HOME BOX LINKS (Main video section)
    handleHomeBoxLinks(features.homeBoxLinks);

    // 0. LOAD SITE CONTENT (if projects data is available)
    // Do this before disabling links so new content is loaded first
    if (config.site && projectsData) {
      // Small delay to ensure DOM is fully ready
      setTimeout(() => {
        loadSiteContent(config.site.mode);

        // Apply link disabling AFTER content is loaded
        setTimeout(() => {
          handleProjectsListing(features.projectsListing.clickable);
        }, 50);
      }, 100);
    } else {
      // If no content to load, just disable existing links
      handleProjectsListing(features.projectsListing.clickable);
    }

    // Log current mode
    if (config.demo.mode) {
      console.log('🎨 DEMO MODE: Most interactive features disabled');
    } else {
      console.log('✓ FULL MODE: All features enabled');
    }
  }

  // Handle intro animation visibility
  function handleIntroAnimation(enabled) {
    const introBloc = document.querySelector('.bloc-intro');
    if (introBloc) {
      if (!enabled) {
        introBloc.style.display = 'none';
        console.log('✓ Intro animation hidden');
      } else {
        introBloc.style.display = '';
        console.log('✓ Intro animation enabled');
      }
    }
  }

  // Handle navigation links (Works, About, Contact)
  function handleNavigationLinks(navConfig) {
    const navItems = {
      works: {
        enabled: navConfig.worksPage.enabled,
        selector: 'a[data-slug="works"]'
      },
      about: {
        enabled: navConfig.aboutPage.enabled,
        selector: 'a[data-slug="about"]'
      },
      contact: {
        enabled: navConfig.contactPage.enabled,
        selector: 'a[data-slug="contact"]'
      }
    };

    Object.entries(navItems).forEach(([page, settings]) => {
      const link = document.querySelector(settings.selector);
      if (link) {
        if (!settings.enabled) {
          disableLink(link);
          console.log(`✓ ${page} link disabled`);
        } else {
          enableLink(link);
        }
      }
    });
  }

  // Handle projects navigation (category filters)
  function handleProjectsNav(enabled) {
    const projectsNav = document.querySelector('.projects-nav');
    if (projectsNav) {
      if (!enabled) {
        projectsNav.style.display = 'none';
        // Also disable all filter links
        const filterLinks = projectsNav.querySelectorAll('.js-filter-cat');
        filterLinks.forEach(link => disableLink(link));
        console.log('✓ Projects navigation hidden and disabled');
      } else {
        projectsNav.style.display = '';
        const filterLinks = projectsNav.querySelectorAll('.js-filter-cat');
        filterLinks.forEach(link => enableLink(link));
      }
    }
  }

  // Handle home box links (main video section)
  function handleHomeBoxLinks(homeBoxConfig) {
    // Disable main video link (desktop)
    const mainVideoLink = document.querySelector('.box--home__link');
    if (mainVideoLink) {
      if (!homeBoxConfig.videoClickable.enabled) {
        disableLink(mainVideoLink);
        console.log('✓ Home box video link disabled');
      } else {
        enableLink(mainVideoLink);
      }
    }

    // Disable video items in the list
    const videoListLinks = document.querySelectorAll(
      '.box--home .list--home a.js-change-video'
    );
    videoListLinks.forEach(link => {
      if (!homeBoxConfig.videoClickable.enabled) {
        disableLink(link);
      } else {
        enableLink(link);
      }
    });

    // Disable mobile "view project" button
    const mobileLink = document.querySelector(
      '.box--home__buttons-mobile .mobile-link'
    );
    if (mobileLink) {
      if (!homeBoxConfig.mobileViewProject.enabled) {
        disableLink(mobileLink);
        mobileLink.style.opacity = '0.5';
        mobileLink.style.cursor = 'not-allowed';
        console.log('✓ Mobile view project button disabled');
      } else {
        enableLink(mobileLink);
        mobileLink.style.opacity = '';
        mobileLink.style.cursor = '';
      }
    }
  }

  // Handle projects listing clickability
  function handleProjectsListing(enabled) {
    // Target all possible selectors
    const selectors = [
      '.bloc-projects-listing .box--work__link',
      '.bloc-projects-listing a[href*="works/"]',
      '.list--works .box--work a',
      'a.js-has-cursor-text'
    ];

    const allLinks = new Set();
    selectors.forEach(selector => {
      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        // Only add if it's in the projects listing section
        if (link.closest('.bloc-projects-listing')) {
          allLinks.add(link);
        }
      });
    });

    allLinks.forEach(link => {
      if (!enabled) {
        disableLink(link);
        // Extra measure: wrap the whole list item
        const listItem = link.closest('li.box--work');
        if (listItem) {
          listItem.classList.add('disabled-project');
          listItem.style.pointerEvents = 'none';
          listItem.style.opacity = '0.7';
        }
      } else {
        enableLink(link);
        const listItem = link.closest('li.box--work');
        if (listItem) {
          listItem.classList.remove('disabled-project');
          listItem.style.pointerEvents = '';
          listItem.style.opacity = '';
        }
      }
    });

    if (!enabled) {
      console.log(
        `✓ ${allLinks.size} project listing links disabled (including js-has-cursor-text)`
      );
    }
  }

  // Utility: Disable a link
  function disableLink(element) {
    if (!element) return;

    // Store original href if not already stored
    if (!element.hasAttribute('data-original-href')) {
      element.setAttribute(
        'data-original-href',
        element.getAttribute('href') || ''
      );
    }

    // Store original classes that might have event handlers
    if (element.classList.contains('js-has-cursor-text')) {
      element.setAttribute('data-had-cursor-text', 'true');
      element.classList.remove('js-has-cursor-text');
    }
    if (element.classList.contains('js-change-video')) {
      element.setAttribute('data-had-change-video', 'true');
      element.classList.remove('js-change-video');
    }

    // Change href to # instead of removing (more explicit)
    element.setAttribute('href', '#');
    element.classList.add('disabled-link');
    element.style.cursor = 'default';
    element.style.pointerEvents = 'none';
    element.style.opacity = '0.7';

    // Prevent all types of events (click, touch, etc.)
    element.addEventListener('click', preventClick, {
      capture: true,
      passive: false
    });
    element.addEventListener('touchstart', preventClick, {
      capture: true,
      passive: false
    });
    element.addEventListener('touchend', preventClick, {
      capture: true,
      passive: false
    });
    element.addEventListener('mousedown', preventClick, {
      capture: true,
      passive: false
    });
    element.addEventListener('mouseup', preventClick, {
      capture: true,
      passive: false
    });

    // Also disable data-navigo attribute if present
    if (element.hasAttribute('data-navigo')) {
      element.setAttribute('data-navigo-disabled', 'true');
      element.removeAttribute('data-navigo');
    }
  }

  // Utility: Enable a link
  function enableLink(element) {
    if (!element) return;

    // Restore original href
    const originalHref = element.getAttribute('data-original-href');
    if (originalHref) {
      element.setAttribute('href', originalHref);
    }

    // Restore original JS classes
    if (element.hasAttribute('data-had-cursor-text')) {
      element.classList.add('js-has-cursor-text');
      element.removeAttribute('data-had-cursor-text');
    }
    if (element.hasAttribute('data-had-change-video')) {
      element.classList.add('js-change-video');
      element.removeAttribute('data-had-change-video');
    }

    // Remove disabled class
    element.classList.remove('disabled-link');
    element.style.cursor = '';
    element.style.pointerEvents = '';
    element.style.opacity = '';

    // Remove all event prevention (with same options used when adding)
    element.removeEventListener('click', preventClick, { capture: true });
    element.removeEventListener('touchstart', preventClick, { capture: true });
    element.removeEventListener('touchend', preventClick, { capture: true });
    element.removeEventListener('mousedown', preventClick, { capture: true });
    element.removeEventListener('mouseup', preventClick, { capture: true });

    // Restore data-navigo if it was disabled
    if (element.hasAttribute('data-navigo-disabled')) {
      element.setAttribute('data-navigo', '');
      element.removeAttribute('data-navigo-disabled');
    }
  }

  // Prevent click handler
  function preventClick(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // Global content loading functions (always available for SPA navigation)
  window.loadContactContent = async function() {
    try {
      console.log('Loading contact page content...');
      const data = await window.fetchContact();
      window.PageRenderer.renderContactContent(data.page);
    } catch (error) {
      console.error('Error loading contact content:', error);
    }
  };

  window.loadAboutContent = async function() {
    try {
      console.log('Loading about page content...');
      const data = await window.fetchAbout();
      window.PageRenderer.renderAboutContent(data.page);
    } catch (error) {
      console.error('Error loading about content:', error);
    }
  }

  window.loadProjects = async function() {
    try {
      console.log('Loading projects for works page...');
      const projects = await window.fetchProjects();
      window.PageRenderer.renderWorksProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  window.loadIndexProjects = async function() {
    try {
      console.log('Loading projects for index page...');
      const projects = await window.fetchProjects();
      window.PageRenderer.renderIndexProjects(projects);
      window.PageRenderer.renderHomepageSlider(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  // Update body class based on data-slug
  function updateBodyClass(slug) {
    console.log('🔄 updateBodyClass called with slug:', slug);
    const body = document.body;
    
    // Remove all template classes
    body.classList.remove('template-homepage', 'template-projects', 'template-about', 'template-contact');
    
    // If no slug provided, try to detect from URL or current active link
    if (!slug) {
      const path = window.location.pathname;
      console.log('No slug provided, detecting from path:', path);
      if (path === '/' || path === '/index.html' || path === '/index' || path === '') {
        slug = 'homepage';
      } else if (path.includes('/works')) {
        slug = 'works';
      } else if (path.includes('/about')) {
        slug = 'about';
      } else if (path.includes('/contact')) {
        slug = 'contact';
      }
    }
    
    // Add appropriate class based on slug
    let newClass = '';
    if (slug === 'homepage') {
      newClass = 'template-homepage';
    } else if (slug === 'works') {
      newClass = 'template-projects';
    } else if (slug === 'about') {
      newClass = 'template-about';
    } else if (slug === 'contact') {
      newClass = 'template-contact';
    }
    
    if (newClass) {
      body.classList.add(newClass);
      // Force style recalculation
      void body.offsetHeight;
      console.log('✓ Body class updated:', newClass);
      console.log('✓ Current body classes:', body.className);
    } else {
      console.warn('⚠ No matching template class for slug:', slug);
    }
  }

  // Listen for route changes and reapply header styles
  function setupRouteChangeListener() {
    console.log('🔧 Setting up SPA navigation with header sync...');
    
    // Set flag immediately to prevent app-init.js from loading initial page
    window.__initialPageLoaded = true;
    
    // Store the target page slug when a link is clicked
    let targetSlug = null;
    let contentChangeDetected = false;
    
    // Capture clicks on navigation links BEFORE the router processes them
    document.addEventListener('click', function(e) {
      console.log('👁 Click detected on:', e.target);
      const link = e.target.closest('[data-navigo]');
      console.log('🔗 Closest data-navigo link:', link);
      
      if (link) {
        const slug = link.getAttribute('data-slug');
        const href = link.getAttribute('href');
        console.log('🎯 Navigation link found - slug:', slug, 'href:', href);
        
        if (slug) {
          targetSlug = slug;
          contentChangeDetected = false;
          console.log('✅ Target page set:', targetSlug);
        } else {
          console.warn('⚠ Link has no data-slug attribute');
        }
      }
    }, true); // Use capture phase to run before router

    // Watch for DOM changes to detect when new content loads
    let debounceTimer = null;
    const observer = new MutationObserver(function(mutations) {
      if (DEBUG_LOGS) console.log('📡 MutationObserver triggered, mutations:', mutations.length);
      
      // Only process if we have a target slug and haven't already updated
      if (!targetSlug) {
        if (DEBUG_LOGS) console.log('⏸ No target slug set, skipping...');
        return;
      }
      if (contentChangeDetected) {
        if (DEBUG_LOGS) console.log('⏸ Content already detected, skipping...');
        return;
      }
      
      // Debounce to avoid multiple triggers
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (DEBUG_LOGS) console.log('🔍 DOM changed, checking if content loaded for:', targetSlug);
        
        // Verify content has actually changed by checking for page-specific elements
        let contentLoaded = false;
        
        if (targetSlug === 'contact') {
          const staffList = document.querySelector('.list--staff');
          const addressBox = document.querySelector('.box--address');
          contentLoaded = staffList || addressBox || document.body.textContent.includes('Loading staff');
          if (DEBUG_LOGS) console.log('Contact elements found:', { staffList: !!staffList, addressBox: !!addressBox });
        } else if (targetSlug === 'about') {
          const aboutBox = document.querySelector('.box--about');
          contentLoaded = aboutBox || document.body.textContent.includes('Loading about');
          if (DEBUG_LOGS) console.log('About elements found:', { aboutBox: !!aboutBox });
        } else if (targetSlug === 'works') {
          const listWorks = document.querySelector('.list--works');
          const worksListing = document.querySelector('.bloc-projects-listing');
          const worksContainer = document.getElementById('works-list-project');
          contentLoaded = listWorks || worksListing || worksContainer;
          if (DEBUG_LOGS) console.log('Works elements found:', { listWorks: !!listWorks, worksListing: !!worksListing, worksContainer: !!worksContainer });
        } else if (targetSlug === 'homepage') {
          const homepageSlider = document.getElementById('homepage-slider');
          const worksContainer = document.getElementById('works');
          contentLoaded = homepageSlider || worksContainer;
          if (DEBUG_LOGS) console.log('Homepage elements found:', { slider: !!homepageSlider, works: !!worksContainer });
        }
        
        if (contentLoaded) {
          console.log('✓ Content loaded for:', targetSlug);
          console.log('🔄 Updating body class and header styles...');
          
          updateBodyClass(targetSlug);
          if (headerConfig) {
            applyHeaderStyles();
          }
          
          // Trigger page-specific content loading
          console.log('📦 Triggering content loader for:', targetSlug);
          
          if (targetSlug === 'contact') {
            console.log('✅ Calling loadContactContent()');
            window.loadContactContent();
          } else if (targetSlug === 'about') {
            if (typeof window.loadAboutContent === 'function') {
              console.log('✅ Calling loadAboutContent()');
              window.loadAboutContent();
            } else {
              console.warn('⚠ loadAboutContent not defined yet');
            }
          } else if (targetSlug === 'works') {
            if (typeof window.loadProjects === 'function') {
              console.log('✅ Calling loadProjects()');
              window.loadProjects();
            } else {
              console.warn('⚠ loadProjects not defined yet');
            }
          } else if (targetSlug === 'homepage') {
            if (typeof window.loadIndexProjects === 'function') {
              console.log('✅ Calling loadIndexProjects()');
              window.loadIndexProjects();
            } else {
              console.warn('⚠ loadIndexProjects not defined yet');
            }
          }
          
          contentChangeDetected = true;
          
          // Reset after a delay to allow for next navigation
          setTimeout(() => {
            targetSlug = null;
            contentChangeDetected = false;
          }, 500);
        }
      }, 150);
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    console.log('✓ MutationObserver started');

    // Update body class on initial load
    console.log('🔍 Detecting initial page on load...');
    console.log('Current URL:', window.location.pathname);
    console.log('Current body class:', document.body.className);
    
    // Detect initial page from body class or URL
    let initialSlug = null;
    if (document.body.classList.contains('template-homepage')) {
      initialSlug = 'homepage';
    } else if (document.body.classList.contains('template-projects')) {
      initialSlug = 'works';
    } else if (document.body.classList.contains('template-about')) {
      initialSlug = 'about';
    } else if (document.body.classList.contains('template-contact')) {
      initialSlug = 'contact';
    }
    
    if (initialSlug) {
      console.log('✓ Initial page detected from body class:', initialSlug);
      // Body class is already correct, just apply header styles
      if (headerConfig) {
        console.log('🎨 Applying header styles for initial page...');
        applyHeaderStyles();
      }
      
      // Load content for initial page
      console.log('📦 Loading initial page content for:', initialSlug);
      
      setTimeout(() => {
        if (initialSlug === 'works') {
          if (typeof window.loadProjects === 'function') {
            console.log('✅ Calling loadProjects() for initial page load');
            window.loadProjects();
          }
        } else if (initialSlug === 'homepage') {
          if (typeof window.loadIndexProjects === 'function') {
            console.log('✅ Calling loadIndexProjects() for initial page load');
            window.loadIndexProjects();
          }
        } else if (initialSlug === 'about') {
          if (typeof window.loadAboutContent === 'function') {
            console.log('✅ Calling loadAboutContent() for initial page load');
            window.loadAboutContent();
          }
        } else if (initialSlug === 'contact') {
          if (typeof window.loadContactContent === 'function') {
            console.log('✅ Calling loadContactContent() for initial page load');
            window.loadContactContent();
          }
        }
      }, 100);
    } else {
      console.log('⚠ No template class found, detecting from URL...');
      updateBodyClass();
    }
    
    console.log('✓ SPA navigation setup complete');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadConfig();
      setupRouteChangeListener();
    });
  } else {
    loadConfig();
    setupRouteChangeListener();
  }

  // Expose reload function for debugging
  window.reloadSiteConfig = loadConfig;
})();
