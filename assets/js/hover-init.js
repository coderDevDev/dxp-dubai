/**
 * Custom Hover Initialization
 * Handles cursor animations and video playback on hover
 * Works with dynamically loaded content
 */

(function() {
  'use strict';

  function initializeHoverEffects() {
    console.log('🎯 Initializing custom hover effects...');
    
    // Find all project boxes
    const projectBoxes = document.querySelectorAll('.box--work');
    console.log(`Found ${projectBoxes.length} project boxes`);
    
    projectBoxes.forEach((box, index) => {
      const video = box.querySelector('video.js-video');
      const link = box.querySelector('.box--work__link');
      
      if (!video || !link) return;
      
      // Ensure video has src
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      
      // Load video
      if (video.readyState < 2) {
        video.load();
      }
      
      // Remove any existing listeners to avoid duplicates
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // Add hover listeners
      newLink.addEventListener('mouseenter', function() {
        const vid = box.querySelector('video.js-video');
        if (!vid) return;
        
        const currentSrc = vid.currentSrc || vid.src || '';
        const isDirectMp4 = /\.mp4(\?|$)/i.test(currentSrc);
        
        console.log('🎯 Hover enter:', { src: currentSrc, isDirectMp4, readyState: vid.readyState, paused: vid.paused });
        
        if (!isDirectMp4) return;
        
        if (vid.readyState >= 2 && vid.paused) {
          vid.play().then(() => {
            console.log('✓ Video playing');
          }).catch((err) => {
            console.log('❌ Video play failed:', err.message);
          });
        }
      });
      
      newLink.addEventListener('mouseleave', function() {
        const vid = box.querySelector('video.js-video');
        if (!vid) return;
        
        console.log('🎯 Hover leave:', { paused: vid.paused });
        
        if (!vid.paused) {
          vid.pause();
          vid.currentTime = 0;
          console.log('✓ Video paused');
        }
      });
    });
    
    console.log('✓ Custom hover effects initialized');
  }
  
  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHoverEffects);
  } else {
    initializeHoverEffects();
  }
  
  // Re-initialize when content is dynamically loaded
  window.addEventListener('projects-rendered', function() {
    console.log('🔄 Projects rendered, re-initializing hover effects...');
    setTimeout(initializeHoverEffects, 100);
  });
  
  // Expose function globally for manual re-initialization
  window.reinitHoverEffects = initializeHoverEffects;
  
})();
