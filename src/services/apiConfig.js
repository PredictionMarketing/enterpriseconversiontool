import axios from 'axios';

// Helper function to extract YouTube video ID from URL
export const extractYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Google Cloud API base configuration
export const googleCloudConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  baseURL: 'https://cloud.googleapis.com',
};

// Create axios instance for Google Cloud APIs
export const googleCloudClient = axios.create({
  baseURL: googleCloudConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${googleCloudConfig.apiKey}`
  }
});

// YouTube API configuration
export const youtubeConfig = {
  apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
  baseURL: 'https://www.googleapis.com/youtube/v3'
};

// Create axios instance for YouTube API
export const youtubeClient = axios.create({
  baseURL: youtubeConfig.baseURL,
  params: {
    key: youtubeConfig.apiKey
  }
});

// Export API endpoints for different services
export const apiEndpoints = {
  speechToText: '/speech/v1/speech:recognize',
  textToSpeech: '/text-to-speech/v1/text:synthesize',
  translate: '/translate/v2',
  documentAi: '/v1/projects/your-project-id/locations/us/processors',
  storage: '/storage/v1/b'
};
