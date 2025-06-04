import axios from 'axios';

/**
 * Service for interacting with Google's Gemini AI API
 */
export const geminiClient = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1',
  params: {
    key: import.meta.env.VITE_GEMINI_API_KEY
  }
});

/**
 * Converts content to text using Gemini AI
 * @param {string} content - The content to process (could be text from YouTube, audio, etc.)
 * @param {Object} options - Additional options for the conversion
 * @returns {Promise<Object>} - The processed text result
 */
export const convertToText = async (content, options = {}) => {
  try {
    const response = await geminiClient.post('/models/gemini-pro:generateContent', {
      contents: [{
        parts: [{
          text: `Convert the following content to text format: ${content}`
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    return {
      text: response.data.candidates[0].content.parts[0].text,
      title: options.title || 'Gemini AI Conversion'
    };
  } catch (error) {
    console.error('Gemini AI conversion error:', error);
    throw new Error('Failed to convert content using Gemini AI');
  }
};

/**
 * Converts content to a structured course format using Gemini AI
 * @param {string} content - The content to process
 * @returns {Promise<Object>} - The course structure
 */
export const convertToCourse = async (content) => {
  try {
    const response = await geminiClient.post('/models/gemini-pro:generateContent', {
      contents: [{
        parts: [{
          text: `Convert the following content into a structured training course with modules, lessons, and key points: ${content}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    return {
      contentType: 'application/json',
      content: response.data.candidates[0].content.parts[0].text,
      title: 'Generated Course'
    };
  } catch (error) {
    console.error('Gemini AI course conversion error:', error);
    throw new Error('Failed to create course using Gemini AI');
  }
};

/**
 * Summarizes content using Gemini AI
 * @param {string} content - The content to summarize
 * @returns {Promise<Object>} - The summarized content
 */
export const summarizeContent = async (content) => {
  try {
    const response = await geminiClient.post('/models/gemini-pro:generateContent', {
      contents: [{
        parts: [{
          text: `Provide a comprehensive summary of the following content: ${content}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });
    
    return {
      text: response.data.candidates[0].content.parts[0].text,
      title: 'Content Summary'
    };
  } catch (error) {
    console.error('Gemini AI summarization error:', error);
    throw new Error('Failed to summarize content using Gemini AI');
  }
};

/**
 * Translates content using Gemini AI
 * @param {string} content - The content to translate
 * @param {string} targetLanguage - The target language
 * @returns {Promise<Object>} - The translated content
 */
export const translateContent = async (content, targetLanguage) => {
  try {
    const response = await geminiClient.post('/models/gemini-pro:generateContent', {
      contents: [{
        parts: [{
          text: `Translate the following content to ${targetLanguage}: ${content}`
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    return {
      text: response.data.candidates[0].content.parts[0].text,
      title: `Translated to ${targetLanguage}`
    };
  } catch (error) {
    console.error('Gemini AI translation error:', error);
    throw new Error(`Failed to translate content to ${targetLanguage}`);
  }
};
