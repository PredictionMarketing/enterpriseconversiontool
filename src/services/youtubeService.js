import { youtubeClient, extractYoutubeId } from './apiConfig';

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
    
    const response = await youtubeClient.get('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId
      }
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

/**
 * Fetch YouTube video captions/transcript
 * @param {string} videoId - YouTube video ID
 * @returns {Promise} - Video captions data
 */
export const getVideoTranscript = async (videoId) => {
  try {
    // First, get available caption tracks
    const captionResponse = await youtubeClient.get('/captions', {
      params: {
        part: 'snippet',
        videoId: videoId
      }
    });
    
    if (!captionResponse.data.items || captionResponse.data.items.length === 0) {
      throw new Error('No captions available for this video');
    }
    
    // Find English captions or use the first available
    const captionTrack = captionResponse.data.items.find(
      item => item.snippet.language === 'en'
    ) || captionResponse.data.items[0];
    
    // Note: Actual caption download requires OAuth2 authentication
    // This is a simplified version - in production, you'd need to implement
    // OAuth2 flow and use the captions.download method
    
    return {
      captionId: captionTrack.id,
      language: captionTrack.snippet.language,
      // In a real implementation, you would download and parse the actual transcript
      transcriptAvailable: true
    };
  } catch (error) {
    console.error('Error fetching video transcript:', error);
    throw error;
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
    const videoDetails = await getVideoDetails(url);
    const transcriptInfo = await getVideoTranscript(videoId);
    
    // In a real implementation, you would:
    // 1. Download the actual transcript
    // 2. Parse it into a readable format
    // 3. Return the formatted text
    
    return {
      title: videoDetails.snippet.title,
      description: videoDetails.snippet.description,
      // This would be the actual transcript in a real implementation
      transcript: `Transcript for video: ${videoDetails.snippet.title}`,
      transcriptAvailable: transcriptInfo.transcriptAvailable,
      duration: videoDetails.contentDetails.duration,
      publishedAt: videoDetails.snippet.publishedAt
    };
  } catch (error) {
    console.error('Error converting YouTube to text:', error);
    throw error;
  }
};
