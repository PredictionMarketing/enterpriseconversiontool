/**
 * Configuration for API clients
 */

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Extracted video ID or null if invalid
 */
export const extractYoutubeId = (url) => {
  if (!url) return null;
  
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  }
  
  // Handle youtube.com format
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * YouTube API client configuration
 * This is kept minimal for YouTube data extraction only
 */
export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
