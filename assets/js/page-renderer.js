/**
 * Centralized Page Renderer
 * Single source of truth for rendering page content
 * Handles all page-specific rendering logic
 */

(function() {
  'use strict';

  const DEBUG_HOVER = false;

  const PageRenderer = {
    renderIndexProjects,
    renderWorksProjects,
    renderHomepageSlider,
    renderAboutContent,
    renderContactContent,
    renderProjectDetail,
    initializePage
  };

  function renderWorksProjects(projects) {
    console.log('Rendering projects for works page...');
    const worksContainer = document.getElementById('works-list-project');

    if (!worksContainer) {
      console.warn('Works list container not found');
      return;
    }

    worksContainer.innerHTML = '';

    projects.forEach(project => {
      const projectHTML = `
      <li class="box box--work" data-cat="${project.data_cat}">
        <a href="${project.link}" class="box--work__link js-has-cursor-text" onclick="event.preventDefault(); event.stopPropagation(); window.location.href='${project.link}'; return false;">
          <div class="box--work__info">
            <h2>${project.title}</h2>
            <p>${project.client}</p>
            <p>${project.category}</p>
          </div>
          <div class="box--work__video video-wrapper has-poster">
            <img class="video-img-poster lazy-media loaded"
              src="${project.poster_image}"
              srcset="${project.poster_image_srcset}"
              alt="">
            <video class="js-video lazy-media loaded"
             src="${project.video_url}"
              playsinline loop muted></video>
          </div>
          <div class="cursor-text-animated js-cursor-text-animated">
            <div class="mooving-elements is-arrow" data-friction="1">
              <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.72366 3.91174H7.0685L5.14349 3.8482L6.53777 4.99985L8.40882 6.65189L7.19444 7.72412L5.3234 6.07209L4.01007 4.83306L4.07303 6.50892L4.06404 8.02593L2.3819 6.54069L2.39989 2.42649L7.04152 2.42649L8.72366 3.91174Z" fill="white"/>
              </svg>
            </div>
            <div class="mooving-elements shift cursor-main-text" data-friction="5">
              <h2>${project.title}</h2>
              <p>${project.client}</p>
              <p>${project.category}</p>
            </div>
          </div>
        </a>
      </li>
    `;

      worksContainer.innerHTML += projectHTML;
    });

    setTimeout(() => {
      if (typeof LazyLoad !== 'undefined' && window.lazyLoadInstance) {
        window.lazyLoadInstance.update();
      }
      
      const videos = worksContainer.querySelectorAll('video.js-video');
      videos.forEach(video => {
        if (video.src && video.readyState < 2) {
          video.load();
        }
      });
      console.log('✓ Initialized', videos.length, 'project videos for works page');
      
      // Dispatch event to trigger hover re-initialization
      setTimeout(() => {
        const event = new Event('projects-rendered');
        window.dispatchEvent(event);
        console.log('✓ Dispatched projects-rendered event for works page');
      }, 200);
    }, 100);
  }

  function renderIndexProjects(projects) {
    console.log('Rendering projects for index page...');
    const worksContainer = document.getElementById('works');

    if (!worksContainer) {
      console.warn('Works container not found');
      return;
    }

    // Check if we have initial projects already loaded
    const initialCount = parseInt(worksContainer.getAttribute('data-initial-count') || '0');
    
    if (initialCount > 0) {
      console.log(`✓ Found ${initialCount} initial projects, updating them with fresh data and loading remaining ${projects.length - initialCount} projects...`);
      
      // Remove initial-count attribute so we don't do this again
      worksContainer.removeAttribute('data-initial-count');
      
      // First, update the initial projects with fresh data
      const initialProjects = worksContainer.querySelectorAll('.initial-project');
      projects.slice(0, initialCount).forEach((project, index) => {
        if (initialProjects[index]) {
          // Update the existing project with fresh data
          const link = initialProjects[index].querySelector('.box--work__link');
          if (link) {
            link.setAttribute('onclick', `window.location.replace('${project.link}'); return false;`);
          }
          
          const video = initialProjects[index].querySelector('video.js-video');
          if (video && project.video_url) {
            video.src = project.video_url;
            video.load();
          }
          
          const img = initialProjects[index].querySelector('.video-img-poster');
          if (img && project.poster_image) {
            img.src = project.poster_image;
            if (project.poster_image_srcset) {
              img.srcset = project.poster_image_srcset;
            }
          }
          
          // Remove the initial-project class
          initialProjects[index].classList.remove('initial-project');
          
          // Update data-cat attribute
          initialProjects[index].setAttribute('data-cat', project.data_cat);
        }
      });
      
      // Then append the remaining projects
      projects.slice(initialCount).forEach(project => {
      const projectHTML = `
      <li class="box box--work" data-cat="${project.data_cat}">
        <a href="javascript:void(0)" class="box--work__link js-has-cursor-text" 
        onclick="window.location.replace('${project.link}'); return false;">
          <div class="box--work__info">
            <h2>${project.title}</h2>
            <p>${project.client}</p>
            <p>${project.category}</p>
          </div>
          <div class="box--work__video video-wrapper has-poster">
            <img class="video-img-poster lazy-media loaded"
              src="${project.poster_image}"
              srcset="${project.poster_image_srcset}"
              alt="">
            <video class="js-video lazy-media loaded"
             src="${project.video_url}"
              playsinline loop muted></video>
          </div>
          <div class="cursor-text-animated js-cursor-text-animated">
            <div class="mooving-elements is-arrow" data-friction="1">
              <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.72366 3.91174H7.0685L5.14349 3.8482L6.53777 4.99985L8.40882 6.65189L7.19444 7.72412L5.3234 6.07209L4.01007 4.83306L4.07303 6.50892L4.06404 8.02593L2.3819 6.54069L2.39989 2.42649L7.04152 2.42649L8.72366 3.91174Z" fill="white"/>
              </svg>
            </div>
            <div class="mooving-elements shift cursor-main-text" data-friction="5">
              <h2>${project.title}</h2>
              <p>${project.client}</p>
              <p>${project.category}</p>
            </div>
          </div>
        </a>
      </li>
    `;

        worksContainer.innerHTML += projectHTML;
      });
    } else {
      // No initial projects, render all from scratch
      console.log('No initial projects found, rendering all projects...');
      worksContainer.innerHTML = '';
      
      projects.forEach(project => {
        const projectHTML = `
      <li class="box box--work" data-cat="${project.data_cat}">
        <a href="javascript:void(0)" class="box--work__link js-has-cursor-text" 
        onclick="window.location.replace('${project.link}'); return false;">
          <div class="box--work__info">
            <h2>${project.title}</h2>
            <p>${project.client}</p>
            <p>${project.category}</p>
          </div>
          <div class="box--work__video video-wrapper has-poster">
            <img class="video-img-poster lazy-media loaded"
              src="${project.poster_image}"
              srcset="${project.poster_image_srcset}"
              alt="">
            <video class="js-video lazy-media loaded"
             src="${project.video_url}"
              playsinline loop muted></video>
          </div>
          <div class="cursor-text-animated js-cursor-text-animated">
            <div class="mooving-elements is-arrow" data-friction="1">
              <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.72366 3.91174H7.0685L5.14349 3.8482L6.53777 4.99985L8.40882 6.65189L7.19444 7.72412L5.3234 6.07209L4.01007 4.83306L4.07303 6.50892L4.06404 8.02593L2.3819 6.54069L2.39989 2.42649L7.04152 2.42649L8.72366 3.91174Z" fill="white"/>
              </svg>
            </div>
            <div class="mooving-elements shift cursor-main-text" data-friction="5">
              <h2>${project.title}</h2>
              <p>${project.client}</p>
              <p>${project.category}</p>
            </div>
          </div>
        </a>
      </li>
    `;
        worksContainer.innerHTML += projectHTML;
      });
    }

    setTimeout(() => {
      if (typeof LazyLoad !== 'undefined' && window.lazyLoadInstance) {
        window.lazyLoadInstance.update();
      }
      
      const videos = worksContainer.querySelectorAll('video.js-video');
      videos.forEach(video => {
        if (video.src && video.readyState < 2) {
          video.load();
        }
      });
      console.log('✓ Initialized', videos.length, 'project videos for hover playback');
      
      // Dispatch event to trigger custom hover initialization
      setTimeout(() => {
        const event = new Event('projects-rendered');
        window.dispatchEvent(event);
      }, 200);
    }, 100);
  }

  function renderHomepageSlider(projects) {
    console.log('Rendering homepage slider...');
    const sliderContainer = document.getElementById('homepage-slider');
    
    if (!sliderContainer) {
      console.log('Homepage slider container not found');
      return;
    }

    // Limit to first 7 projects for slider (like posterco.tv)
    const sliderProjects = projects.slice(0, 2);
    console.log(`Using ${sliderProjects.length} projects for slider (from ${projects.length} total)`);

    const hasFallback = sliderContainer.getAttribute('data-has-fallback') === 'true';
    
    if (hasFallback) {
      console.log('✓ Static fallback detected, smooth transition to fresh data');
      
      sliderContainer.style.transition = 'opacity 0.3s ease';
      sliderContainer.style.opacity = '0.7';
      
      setTimeout(() => {
        renderSliderContent(sliderContainer, sliderProjects);
        updateMainVideoSection(sliderProjects);
        updateSliderCounter(sliderProjects.length);
        
        sliderContainer.style.opacity = '1';
        sliderContainer.removeAttribute('data-has-fallback');
        
        console.log('✓ Smooth transition complete - now showing fresh data');
      }, 300);
    } else {
      renderSliderContent(sliderContainer, sliderProjects);
      updateMainVideoSection(sliderProjects);
      updateSliderCounter(sliderProjects.length);
    }
  }
  
  function updateSliderCounter(total) {
    const sliderTotal = document.getElementById('slider-total');
    if (sliderTotal) {
      sliderTotal.textContent = total;
    }
  }
  
  function updateMainVideoSection(projects) {
    if (!projects || projects.length === 0) return;
    
    const firstProject = projects[0];
    const videoWrapper = document.getElementById('homepage-main-video-wrapper');
    
    console.log({firstProject})
    
    // Only update main videos - links and text will be handled by click handler
    if (videoWrapper) {
      let videosHTML = '';
      projects.forEach(project => {
        videosHTML += `
          <video
            class="js-main-video"
            data-src="${project.video_url}"
            muted
            playsinline
          ></video>
        `;
      });
      videoWrapper.innerHTML = videosHTML;
      
      // Load videos
      setTimeout(() => {
        const videos = videoWrapper.querySelectorAll('video[data-src]');
        videos.forEach((video, index) => {
          if (video.dataset.src && !video.src) {
            video.src = video.dataset.src;
            video.load();
            
            // Make first video visible and auto-play
            if (index === 0) {
              video.classList.add('visible', 'loaded');
              video.addEventListener('loadeddata', function() {
                this.play().catch(err => console.log('Auto-play prevented:', err));
                console.log('✓ First video visible and auto-playing');
              }, { once: true });
            }
          }
        });
        console.log('✓ Loaded', videos.length, 'main videos');
        
        // Trigger initial link/text update after videos load
        setTimeout(() => {
          const firstSliderItem = document.querySelector('.list--home .js-change-video');
          if (firstSliderItem) {
            const mainLink = document.getElementById('homepage-main-link');
            const mobileLink = document.getElementById('homepage-mobile-link');
            const cursorText = document.getElementById('homepage-cursor-text');
            const itemTitle = firstSliderItem.querySelector('h2').textContent;
            
            if (mainLink) {
              mainLink.href = firstSliderItem.href;
              mainLink.setAttribute('onclick', `window.location.replace('${firstSliderItem.href}'); return false;`);
              mainLink.setAttribute('data-cursor-text', `Open ${itemTitle}`);
            }
            if (mobileLink) {
              mobileLink.href = firstSliderItem.href;
              mobileLink.setAttribute('onclick', `window.location.replace('${firstSliderItem.href}'); return false;`);
            }
            if (cursorText) cursorText.textContent = `open ${itemTitle}`;
            
            console.log('✓ Initial links and text updated from first slider item');
          }
        }, 50);
      }, 100);
    }
  }

  function renderSliderContent(container, projects) {
    let cursorPlayerHTML = `
      <div class="cursor-player-animated js-cursor-player-animated">
        <div class="mooving-elements players-wrapper is-player" data-friction="7">
    `;
    
    projects.forEach(project => {
      cursorPlayerHTML += `
          <video
            class="js-video player-animated-player"
            data-src="${project.video_url}"
            playsinline=""
            loop=""
            muted=""
          ></video>
      `;
    });
    
    cursorPlayerHTML += `
        </div>
      </div>
    `;

    let listItemsHTML = '';
    projects.forEach((project, index) => {
      listItemsHTML += `
        <li class="${index === 0 ? 'is-active' : ''}">
          <a href="${project.link}" class="js-change-video">
            <h2>${project.title}</h2>
            <p>${project.client}</p>
            <p>${project.category}</p>
          </a>
        </li>
      `;
    });

    container.innerHTML = cursorPlayerHTML + listItemsHTML;
    
    console.log('Homepage slider rendered with', projects.length, 'projects');
    
    setTimeout(() => {
      if (typeof LazyLoad !== 'undefined' && window.lazyLoadInstance) {
        window.lazyLoadInstance.update();
        console.log('✓ Lazy loading updated for homepage slider');
      }
      
      const videos = container.querySelectorAll('video[data-src]');
      videos.forEach((video, index) => {
        if (video.dataset.src && !video.src) {
          const videoUrl = video.dataset.src;
          
          // Check if it's a valid MP4 URL (not HLS .m3u8)
          if (videoUrl.includes('.m3u8')) {
            console.warn(`⚠ Cursor player video ${index + 1} is HLS stream (.m3u8), skipping:`, videoUrl);
            // Try to convert to MP4 if it's a Vimeo URL
            if (videoUrl.includes('vimeo')) {
              console.log('Note: This project uses HLS streaming. Cursor player needs direct MP4 URLs.');
            }
          } else {
            video.src = videoUrl;
            video.load();
            console.log(`✓ Loaded cursor player video ${index + 1}:`, videoUrl.substring(0, 50) + '...');
          }
        }
      });
      console.log('✓ Loaded', videos.length, 'cursor player videos');
      
      if (typeof initCursorPlayer === 'function') {
        initCursorPlayer();
      }
      
      // Dispatch event to trigger cursor player re-initialization
      setTimeout(() => {
        const event = new Event('slider-rendered');
        window.dispatchEvent(event);
        console.log('✓ Dispatched slider-rendered event');
      }, 200);
    }, 100);
  }

  function renderAboutContent(pageData) {
    console.log('Rendering about page content...');
    const aboutBox = document.querySelector('.box--about');
    const aboutButton = document.querySelector('.player-link');

    let contentHTML = '';
    
    if (pageData.founder) {
      contentHTML += `<h2>${pageData.founder.name}</h2>`;
      contentHTML += `<h3>${pageData.founder.title}</h3><br />`;
      contentHTML += pageData.founder.bio;
      contentHTML += '<br /><br />';
    }
    
    if (pageData.content) {
      contentHTML += pageData.content.main_text;
    }

    if (aboutBox) {
      aboutBox.innerHTML = contentHTML;
    }

    if (aboutButton && pageData.content && pageData.content.video_button) {
      aboutButton.innerHTML = `<svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.25 4.56699C7.58333 4.75944 7.58333 5.24056 7.25 5.43301L1.25 8.89711C0.916667 9.08956 0.500001 8.849 0.500001 8.4641L0.500001 1.5359C0.500001 1.151 0.916668 0.910436 1.25 1.10289L7.25 4.56699Z" stroke="currentColor"/>
</svg> ${pageData.content.video_button.text}`;
    }
  }

  function renderContactContent(pageData) {
    console.log('Rendering contact page content...');
    const staffList = document.querySelector('.list--staff');
    const addressBox = document.querySelector('.box--address');

    if (staffList && pageData.staff) {
      staffList.innerHTML = '';

      pageData.staff.forEach(department => {
        const departmentHTML = `
    <li>
      <h2>${department.title}</h2>
      <ul class="list list--members">
        ${department.members
          .map(
            member => `
          <li>
            ${member.name}<br/>
            <a class="lnk lnk--through" href="mailto:${member.email}">${member.email}</a>
          </li>
        `
          )
          .join('')}
      </ul>
    </li>
  `;
        staffList.innerHTML += departmentHTML;
      });
    }

    if (addressBox && pageData.address) {
      let addressHTML = `
  <p>${pageData.address.street ? pageData.address.street + '<br />' : ''}
  ${pageData.address.city}</p>
  <p>
    T&nbsp;: <a class="lnk lnk--through" href="tel:${pageData.address.phone}">${pageData.address.phone}</a><br/>
    E&nbsp;: <a class="lnk lnk--through" href="mailto:${pageData.address.email}">${pageData.address.email}</a>
  </p>
`;
      
      if (pageData.social) {
        addressHTML += '<p>';
        if (pageData.social.vimeo) {
          addressHTML += `Vimeo: <a class="lnk lnk--through" href="${pageData.social.vimeo}" target="_blank" rel="noopener">dubaifilmmaker</a><br/>`;
        }
        if (pageData.social.instagram) {
          addressHTML += `Instagram: <a class="lnk lnk--through" href="${pageData.social.instagram}" target="_blank" rel="noopener">@dubaifilmmaker</a>`;
        }
        addressHTML += '</p>';
      }
      
      addressBox.innerHTML = addressHTML;
    }
  }

  function renderProjectDetail(project) {
    console.log('Rendering project detail:', project.title);
    
    document.getElementById('page-title').textContent = `DubaiFilmMaker – ${project.title}`;
    document.getElementById('page-description').setAttribute('content', `${project.title} - ${project.client}`);
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-client').textContent = project.client;

    const videoElement = document.getElementById('project-video');
    const highQualityVideo = project.video_url;
    videoElement.src = highQualityVideo;

    if (project.credits && project.credits.length > 0) {
      const creditsList = document.getElementById('credits-list');
      creditsList.innerHTML = '';
      
      project.credits.forEach(credit => {
        const dt = document.createElement('dt');
        dt.textContent = credit.role;
        const dd = document.createElement('dd');
        dd.textContent = credit.name;
        creditsList.appendChild(dt);
        creditsList.appendChild(dd);
      });
    } else {
      const creditsLink = document.querySelector('.lnk--credits');
      if (creditsLink) creditsLink.style.display = 'none';
    }
  }

  async function initializePage() {
    const pathname = window.location.pathname;
    
    try {
      if (pathname === '/' || pathname.includes('index')) {
        await loadIndexPage();
      } else if (pathname.includes('about')) {
        await loadAboutPage();
      } else if (pathname.includes('contact')) {
        await loadContactPage();
      } else if (pathname.includes('project-detail')) {
        await loadProjectDetailPage();
      }
    } catch (error) {
      console.error('Error initializing page:', error);
    }
  }

  async function loadIndexPage() {
    const projects = await window.fetchProjects();
    renderIndexProjects(projects);
    renderHomepageSlider(projects);
  }

  async function loadAboutPage() {
    const data = await window.fetchAbout();
    renderAboutContent(data.page);
  }

  async function loadContactPage() {
    const data = await window.fetchContact();
    renderContactContent(data.page);
  }

  async function loadProjectDetailPage() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const projectId = urlParams.get('id');
    
    if (!projectId) {
      console.error('No project ID provided');
      return;
    }

    const projects = await window.fetchProjects();
    const project = projects.find(p => p.id == projectId);
    
    if (!project) {
      console.error('Project not found with ID:', projectId);
      return;
    }

    renderProjectDetail(project);
  }

  // Re-initialize cursor and video hover interactions after dynamic rendering
  function reinitializeInteractions(container) {
    if (DEBUG_HOVER) console.log('Re-initializing cursor and video hover interactions...');
    
    // Re-initialize video hover play/pause
    const videoElements = container.querySelectorAll('.box--work');
    if (DEBUG_HOVER) console.log('Found', videoElements.length, 'project boxes to reinitialize');
    
    videoElements.forEach((box, index) => {
      if (DEBUG_HOVER) console.log(`[hover:init] Processing box ${index + 1}/${videoElements.length}`);
      const video = box.querySelector('video.js-video');
      const link = box.querySelector('.box--work__link');
      
      if (video && link) {
        if (DEBUG_HOVER) {
          console.log('[hover:init] found box', {
            hasVideo: !!video,
            hasLink: !!link,
            dataSrc: video.dataset ? video.dataset.src : undefined,
            src: video.currentSrc || video.src
          });
        }

        // Ensure video has src attribute (not just data-src)
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
        }

        // If the source isn't a direct mp4, the <video> element usually can't play it.
        // (e.g. https://player.vimeo.com/video/... is not a playable mp4 URL)
        const currentSrc = video.currentSrc || video.src || '';
        const isDirectMp4 = /\.mp4(\?|$)/i.test(currentSrc);
        if (DEBUG_HOVER && !isDirectMp4) {
          console.log('[hover:init] non-mp4 video src detected (hover play may fail)', currentSrc);
        }
        
        // Ensure video is loaded
        if (video.readyState < 2) {
          video.load();
        }
        
        // Add hover event listeners
        link.addEventListener('mouseenter', function() {
          if (DEBUG_HOVER) {
            console.log('[hover:enter]', {
              title: box.querySelector('.box--work__info h2')?.textContent,
              src: video.currentSrc || video.src,
              readyState: video.readyState,
              paused: video.paused
            });
          }

          const srcNow = video.currentSrc || video.src || '';
          const directMp4Now = /\.mp4(\?|$)/i.test(srcNow);
          if (!directMp4Now) {
            if (DEBUG_HOVER) console.log('[hover:enter] skipped play (not a direct mp4)', srcNow);
            return;
          }

          // Only play if video is ready
          if (video.readyState >= 2 && video.paused) {
            video.play().catch(err => {
              // Silently handle play errors (video might still be loading)
              if (err.name !== 'AbortError') {
                if (DEBUG_HOVER) console.log('[hover:play:error]', err.name);
              }
            });
          } else if (video.readyState < 2) {
            // Video not ready, load it and play when ready
            video.addEventListener('loadeddata', function onLoaded() {
              if (link.matches(':hover')) {
                video.play().catch(() => {});
              }
              video.removeEventListener('loadeddata', onLoaded);
            }, { once: true });
            video.load();
          }
        });
        
        link.addEventListener('mouseleave', function() {
          if (DEBUG_HOVER) {
            console.log('[hover:leave]', {
              src: video.currentSrc || video.src,
              readyState: video.readyState,
              paused: video.paused
            });
          }
          if (!video.paused) {
            video.pause();
            video.currentTime = 0;
          }
        });
      }
    });
    
    // Trigger global cursor initialization if available
    if (typeof window.initCursorAnimations === 'function') {
      window.initCursorAnimations();
    }
    
    // Trigger global video initialization if available
    if (typeof window.initVideoHover === 'function') {
      window.initVideoHover();
    }
    
    console.log('✓ Interactions re-initialized for', videoElements.length, 'project items');
  }

  window.PageRenderer = PageRenderer;
  console.log('✓ PageRenderer module initialized');
})();
