import { googleCloudClient, apiEndpoints } from './apiConfig';

/**
 * Translate text to another language
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'es' for Spanish)
 * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
 * @returns {Promise} - Translated text
 */
export const translateText = async (text, targetLanguage, sourceLanguage = '') => {
  try {
    // Prepare request payload
    const requestData = {
      q: text,
      target: targetLanguage
    };
    
    // Add source language if provided
    if (sourceLanguage) {
      requestData.source = sourceLanguage;
    }
    
    // Make API request
    const response = await googleCloudClient.post(
      apiEndpoints.translate,
      requestData
    );
    
    // Process and return results
    if (response.data && 
        response.data.data && 
        response.data.data.translations && 
        response.data.data.translations.length > 0) {
      
      return {
        translatedText: response.data.data.translations[0].translatedText,
        detectedSourceLanguage: response.data.data.translations[0].detectedSourceLanguage || sourceLanguage
      };
    }
    
    throw new Error('Translation failed');
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

/**
 * Get available translation languages
 * @returns {Promise} - List of supported languages
 */
export const getAvailableLanguages = async () => {
  try {
    // Make API request
    const response = await googleCloudClient.get(
      `${apiEndpoints.translate}/languages`
    );
    
    // Process and return results
    if (response.data && 
        response.data.data && 
        response.data.data.languages) {
      
      return response.data.data.languages;
    }
    
    throw new Error('Failed to retrieve available languages');
  } catch (error) {
    console.error('Error getting available languages:', error);
    throw error;
  }
};
