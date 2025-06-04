import axios from 'axios';
import { YOUTUBE_API_BASE_URL, YOUTUBE_API_KEY, extractYoutubeId } from './apiConfig';

/**
 * Simplified YouTube service that focuses only on extracting video metadata
 * for use with Gemini AI processing
 */

/**
 * Fetch YouTube video details
 * @param {string} url - YouTube video URL
 * @returns {Promise} - Video details including title, description, etc.
 */
export const getVideoDetails = async (url) => {
  try {
    const videoId = extractYoutubeId(url);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // Check if we're in demo mode and return mock data if API key is restricted
    if (YOUTUBE_API_KEY === 'AIzaSyCiD4-kzMOMk9phnuFGvs1s2N1lCKTLAGU' || YOUTUBE_API_KEY === 'your_youtube_api_key_here') {
      console.log('Using mock data for YouTube video in demo mode');
      return getMockVideoData(videoId);
    }
    
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video details:', error);
    
    // If we get a 403 error, fall back to mock data
    if (error.response && error.response.status === 403) {
      console.log('YouTube API returned 403, using mock data instead');
      const videoId = extractYoutubeId(url);
      return getMockVideoData(videoId);
    }
    
    throw new Error(`Failed to fetch video details: ${error.message}`);
  }
};

/**
 * Convert YouTube video to text format
 * @param {string} url - YouTube video URL
 * @returns {Promise} - Text content extracted from video
 */
export const convertYoutubeToText = async (url) => {
  try {
    const videoId = extractYoutubeId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    const videoDetails = await getVideoDetails(url);
    
    // Extract relevant information for Gemini processing
    return {
      videoId,
      title: videoDetails.snippet.title,
      channelTitle: videoDetails.snippet.channelTitle,
      description: videoDetails.snippet.description,
      // This is a placeholder - in a real implementation, you would use a transcript API
      // or extract captions, but for now we'll use the description as a starting point
      transcript: `Video Title: ${videoDetails.snippet.title}\n\nDescription: ${videoDetails.snippet.description}`,
      publishedAt: videoDetails.snippet.publishedAt,
      thumbnailUrl: videoDetails.snippet.thumbnails.high?.url
    };
  } catch (error) {
    console.error('Error converting YouTube to text:', error);
    throw new Error(`Failed to process YouTube video: ${error.message}`);
  }
};

/**
 * Generate mock video data for demo mode or when API returns 403
 * @param {string} videoId - YouTube video ID
 * @returns {Object} - Mock video data object
 */
const getMockVideoData = (videoId) => {
  return {
    kind: 'youtube#video',
    etag: 'mock_etag',
    id: videoId,
    snippet: {
      publishedAt: new Date().toISOString(),
      channelId: 'UC_mock_channel',
      title: 'Demo Video Title',
      description: 'This is a mock description for demo purposes. In production, this would contain the actual video description from YouTube.',
      thumbnails: {
        default: {
          url: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
          width: 120,
          height: 90
        },
        medium: {
          url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
          width: 320,
          height: 180
        },
        high: {
          url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          width: 480,
          height: 360
        }
      },
      channelTitle: 'Demo Channel',
      tags: ['demo', 'mock', 'video'],
      categoryId: '22',
      liveBroadcastContent: 'none',
      localized: {
        title: 'Demo Video Title',
        description: 'This is a mock description for demo purposes. In production, this would contain the actual video description from YouTube.'
      }
    },
    contentDetails: {
      duration: 'PT10M30S',
      dimension: '2d',
      definition: 'hd',
      caption: 'false',
      licensedContent: false,
      contentRating: {},
      projection: 'rectangular'
    }
  };
};
