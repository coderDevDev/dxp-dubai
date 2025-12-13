// API Configuration
// Switch between local JSON and CMS API
const API_CONFIG = {
  // Set to true to use CMS API, false to use local JSON
  USE_CMS_API: true,
  
  // CMS API base URL (update this with your actual CMS URL)
  CMS_BASE_URL: 'http://localhost:3001/api',
  
  // Local JSON fallback paths
  LOCAL_PATHS: {
    projects: 'data/project.json',
    about: 'data/about.json',
    contact: 'data/contact.json',
    header: 'data/header.json'
  }
};

// Generic fetch function with fallback
async function fetchData(endpoint, localPath) {
  try {
    const url = API_CONFIG.USE_CMS_API 
      ? `${API_CONFIG.CMS_BASE_URL}/${endpoint}`
      : localPath;
    
    console.log(`Fetching ${endpoint} from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    
    // If CMS API fails, try fallback to local JSON
    if (API_CONFIG.USE_CMS_API) {
      console.log(`CMS API failed for ${endpoint}, falling back to local JSON...`);
      try {
        const response = await fetch(localPath);
        return await response.json();
      } catch (fallbackError) {
        console.error(`Fallback to local JSON also failed for ${endpoint}:`, fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
}

// Fetch projects from either CMS API or local JSON
async function fetchProjects() {
  const data = await fetchData('projects', API_CONFIG.LOCAL_PATHS.projects);
  return data.projects || [];
}

// Fetch about content
async function fetchAbout() {
  return await fetchData('about', API_CONFIG.LOCAL_PATHS.about);
}

// Fetch contact info
async function fetchContact() {
  return await fetchData('contact', API_CONFIG.LOCAL_PATHS.contact);
}

// Fetch header config
async function fetchHeader() {
  return await fetchData('header', API_CONFIG.LOCAL_PATHS.header);
}

// Make all functions available globally
window.fetchProjects = fetchProjects;
window.fetchAbout = fetchAbout;
window.fetchContact = fetchContact;
window.fetchHeader = fetchHeader;
window.API_CONFIG = API_CONFIG;
