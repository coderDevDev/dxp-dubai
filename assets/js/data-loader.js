/**
 * Centralized Data Loader
 * Single source of truth for all data fetching operations
 * Handles API/JSON fallback and caching
 */

(function () {
  'use strict';

  const API_CONFIG = {
    USE_CMS_API: true,
    CMS_BASE_URL: 'https://dxp-dubai-cms-cop4.vercel.app/api',
    LOCAL_PATHS: {
      projects: 'data/project.json',
      about: 'data/about.json',
      contact: 'data/contact.json',
      header: 'data/header.json'
    }
  };

  const cache = {};

  async function fetchData(endpoint, localPath) {
    const cacheKey = endpoint || localPath;

    if (cache[cacheKey]) {
      console.log(`✓ Using cached data for: ${cacheKey}`);
      return cache[cacheKey];
    }

    try {
      const url = API_CONFIG.USE_CMS_API
        ? `${API_CONFIG.CMS_BASE_URL}/${endpoint}`
        : localPath;

      console.log(`Fetching ${endpoint || 'data'} from: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      cache[cacheKey] = data;
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint || 'data'}:`, error);

      if (API_CONFIG.USE_CMS_API && localPath) {
        console.log(`CMS API failed, falling back to local JSON...`);
        try {
          const response = await fetch(localPath);
          const data = await response.json();
          cache[cacheKey] = data;
          return data;
        } catch (fallbackError) {
          console.error(`Fallback to local JSON also failed:`, fallbackError);
          throw fallbackError;
        }
      }

      throw error;
    }
  }

  async function fetchProjects() {
    const data = await fetchData('projects', API_CONFIG.LOCAL_PATHS.projects);
    return data.projects || [];
  }

  async function fetchAbout() {
    return await fetchData('about', API_CONFIG.LOCAL_PATHS.about);
  }

  async function fetchContact() {
    return await fetchData('contact', API_CONFIG.LOCAL_PATHS.contact);
  }

  async function fetchHeader() {
    return await fetchData('header', API_CONFIG.LOCAL_PATHS.header);
  }

  function clearCache() {
    Object.keys(cache).forEach(key => delete cache[key]);
    console.log('✓ Cache cleared');
  }

  window.DataLoader = {
    fetchProjects,
    fetchAbout,
    fetchContact,
    fetchHeader,
    clearCache,
    config: API_CONFIG
  };

  window.fetchProjects = fetchProjects;
  window.fetchAbout = fetchAbout;
  window.fetchContact = fetchContact;
  window.fetchHeader = fetchHeader;
  window.API_CONFIG = API_CONFIG;

  console.log('✓ DataLoader module initialized');
})();
