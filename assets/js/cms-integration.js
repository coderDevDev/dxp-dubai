/**
 * Poster.tv CMS Integration
 * This script fetches content from the CMS API and updates the existing HTML
 * Add this script to your index.html before the closing </body> tag:
 * <script src="assets/js/cms-integration.js"></script>
 */

(function() {
    'use strict';
    
    const CMS_API = '/api/projects.php';
    const VIMEO_BASE = 'https://player.vimeo.com/progressive_redirect/playback';
    
    /**
     * Initialize CMS content loading
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadDynamicContent);
        } else {
            loadDynamicContent();
        }
    }
    
    /**
     * Load all dynamic content from CMS
     */
    async function loadDynamicContent() {
        try {
            // Load featured projects for homepage carousel
            const featuredResponse = await fetch(`${CMS_API}?featured=1`);
            const featuredProjects = await featuredResponse.json();
            
            if (featuredProjects && featuredProjects.length > 0) {
                updateFeaturedCarousel(featuredProjects);
                updateCounter(featuredProjects.length);
            }
            
            // Load all projects for the grid
            const allResponse = await fetch(CMS_API);
            const allProjects = await allResponse.json();
            
            if (allProjects && allProjects.length > 0) {
                updateProjectsGrid(allProjects);
            }
            
            console.log('✅ CMS content loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load CMS content:', error);
            console.log('Falling back to static content');
            // Static content will remain if API fails
        }
    }
    
    /**
     * Update featured carousel on homepage
     */
    function updateFeaturedCarousel(projects) {
        const listContainer = document.querySelector('.list--home');
        const videoContainer = document.querySelector('.box--home__wrapper');
        
        if (!listContainer || !videoContainer) return;
        
        // Preserve the small video players wrapper
        const smallPlayersWrapper = listContainer.querySelector('.cursor-player-animated');
        
        // Clear containers
        listContainer.innerHTML = '';
        videoContainer.innerHTML = '';
        
        // Re-add small players wrapper if it exists
        if (smallPlayersWrapper) {
            updateSmallPlayers(smallPlayersWrapper, projects);
            listContainer.appendChild(smallPlayersWrapper);
        }
        
        // Add each project
        projects.forEach((project, index) => {
            // Create list item
            const li = createListItem(project, index);
            listContainer.appendChild(li);
            
            // Create main video
            const video = createMainVideo(project, index);
            videoContainer.appendChild(video);
        });
        
        // Update the link in box--home__link
        updateMainProjectLink(projects[0]);
        
        // Reinitialize video switcher if function exists
        if (typeof window.initializeVideoSwitcher === 'function') {
            window.initializeVideoSwitcher();
        }
    }
    
    /**
     * Update small video players in cursor animation
     */
    function updateSmallPlayers(wrapper, projects) {
        const playersContainer = wrapper.querySelector('.players-wrapper');
        if (!playersContainer) return;
        
        playersContainer.innerHTML = '';
        
        projects.forEach(project => {
            const video = document.createElement('video');
            video.className = 'js-video player-animated-player';
            video.setAttribute('data-src', buildVimeoUrl(project.vimeo_id_720p, '720p'));
            video.setAttribute('playsinline', '');
            video.setAttribute('loop', '');
            video.setAttribute('muted', '');
            playersContainer.appendChild(video);
        });
    }
    
    /**
     * Create list item for project
     */
    function createListItem(project, index) {
        const li = document.createElement('li');
        li.className = index === 0 ? 'is-active' : '';
        
        const a = document.createElement('a');
        a.href = `works/${project.slug}`;
        a.className = 'js-change-video';
        
        a.innerHTML = `
            <h2>${escapeHtml(project.title)}</h2>
            <p>${escapeHtml(project.director)}</p>
            <p>${formatCategory(project.category)}</p>
        `;
        
        li.appendChild(a);
        return li;
    }
    
    /**
     * Create main video element
     */
    function createMainVideo(project, index) {
        const video = document.createElement('video');
        video.className = 'js-main-video' + (index === 0 ? ' visible' : '');
        video.setAttribute('data-src', buildVimeoUrl(project.vimeo_id_1080p, '1080p'));
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        return video;
    }
    
    /**
     * Update main project link
     */
    function updateMainProjectLink(project) {
        const mainLink = document.querySelector('.box--home__link');
        if (!mainLink) return;
        
        mainLink.href = `works/${project.slug}`;
        mainLink.setAttribute('data-navigo', '');
        
        // Update cursor text
        const cursorText = mainLink.querySelector('.cursor-main-text');
        if (cursorText) {
            cursorText.textContent = `open ${project.title}`;
        }
    }
    
    /**
     * Update projects grid
     */
    function updateProjectsGrid(projects) {
        const gridContainer = document.querySelector('.list--works');
        if (!gridContainer) return;
        
        gridContainer.innerHTML = '';
        
        projects.forEach(project => {
            const li = createProjectCard(project);
            gridContainer.appendChild(li);
        });
        
        // Reinitialize lazy loading if function exists
        if (typeof window.reinitializeLazyLoad === 'function') {
            window.reinitializeLazyLoad();
        }
        
        // Mark as ready
        const blocListing = document.querySelector('.bloc-projects-listing');
        if (blocListing) {
            blocListing.classList.add('ready');
        }
    }
    
    /**
     * Create project card for grid
     */
    function createProjectCard(project) {
        const li = document.createElement('li');
        li.className = 'box box--work';
        li.setAttribute('data-cat', project.category);
        
        const a = document.createElement('a');
        a.href = `works/${project.slug}`;
        a.className = 'box--work__link js-has-cursor-text';
        a.setAttribute('data-navigo', '');
        
        a.innerHTML = `
            <div class="box--work__info">
                <h2>${escapeHtml(project.title)}</h2>
                <p>${escapeHtml(project.director)}</p>
                <p>${formatCategory(project.category)}</p>
            </div>
            
            <div class="box--work__video video-wrapper has-poster">
                ${project.poster_image_url ? `
                    <img class="video-img-poster lazy-media" 
                         data-src="${escapeHtml(project.poster_image_url)}" 
                         alt="${escapeHtml(project.title)}">
                ` : ''}
                <video class="js-video lazy-media" 
                       data-src="${buildVimeoUrl(project.vimeo_id_720p, '720p')}"
                       playsinline loop muted></video>
            </div>
            
            <div class="cursor-text-animated js-cursor-text-animated">
                <div class="mooving-elements is-arrow" data-friction="1">
                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.72366 3.91174H7.0685L5.14349 3.8482L6.53777 4.99985L8.40882 6.65189L7.19444 7.72412L5.3234 6.07209L4.01007 4.83306L4.07303 6.50892L4.06404 8.02593L2.3819 6.54069L2.39989 2.42649L7.04152 2.42649L8.72366 3.91174Z" fill="white"/>
                    </svg>
                </div>
                <div class="mooving-elements shift cursor-main-text" data-friction="5">
                    <h2>${escapeHtml(project.title)}</h2>
                    <p>${escapeHtml(project.director)}</p>
                    <p>${formatCategory(project.category)}</p>
                </div>
            </div>
        `;
        
        li.appendChild(a);
        return li;
    }
    
    /**
     * Update counter display
     */
    function updateCounter(total) {
        const counter = document.querySelector('.box--home__info__counter span');
        if (counter) {
            counter.textContent = '1';
        }
        
        const counterParent = document.querySelector('.box--home__info__counter');
        if (counterParent && total > 0) {
            counterParent.innerHTML = `<span>1</span>/${total}`;
        }
    }
    
    /**
     * Build Vimeo video URL
     */
    function buildVimeoUrl(videoId, quality) {
        // Using the same URL pattern as your existing site
        return `${VIMEO_BASE}/${videoId}/rendition/${quality}/file.mp4?loc=external&oauth2_token_id=1774001646&signature=dummy`;
    }
    
    /**
     * Format category for display
     */
    function formatCategory(category) {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Initialize
    init();
    
})();
