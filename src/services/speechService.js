import { googleCloudClient, apiEndpoints } from './apiConfig';

/**
 * Convert audio to text using Google Cloud Speech-to-Text API
 * @param {File} audioFile - Audio file to transcribe
 * @returns {Promise} - Transcribed text
 */
export const convertAudioToText = async (audioFile) => {
  try {
    // Convert file to base64
    const reader = new FileReader();
    const audioBase64 = await new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioFile);
    });
    
    // Prepare request payload
    const requestData = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default'
      },
      audio: {
        content: audioBase64
      }
    };
    
    // Make API request
    const response = await googleCloudClient.post(
      apiEndpoints.speechToText,
      requestData
    );
    
    // Process and return results
    if (response.data && 
        response.data.results && 
        response.data.results.length > 0) {
      
      // Combine all transcription results
      const transcript = response.data.results
        .map(result => result.alternatives[0].transcript)
        .join(' ');
      
      return {
        transcript,
        confidence: response.data.results[0].alternatives[0].confidence
      };
    }
    
    throw new Error('No transcription results returned');
  } catch (error) {
    console.error('Error converting audio to text:', error);
    throw error;
  }
};

/**
 * Convert text to audio using Google Cloud Text-to-Speech API
 * @param {string} text - Text to convert to speech
 * @param {Object} options - Voice options (voice name, language, etc.)
 * @returns {Promise} - Audio content as base64 encoded string
 */
export const convertTextToAudio = async (text, options = {}) => {
  try {
    // Default options
    const voiceOptions = {
      languageCode: 'en-US',
      name: 'en-US-Neural2-F',
      ssmlGender: 'FEMALE',
      ...options
    };
    
    // Prepare request payload
    const requestData = {
      input: {
        text
      },
      voice: voiceOptions,
      audioConfig: {
        audioEncoding: 'MP3'
      }
    };
    
    // Make API request
    const response = await googleCloudClient.post(
      apiEndpoints.textToSpeech,
      requestData
    );
    
    // Return audio content
    if (response.data && response.data.audioContent) {
      return {
        audioContent: response.data.audioContent,
        contentType: 'audio/mp3'
      };
    }
    
    throw new Error('No audio content returned');
  } catch (error) {
    console.error('Error converting text to audio:', error);
    throw error;
  }
};
