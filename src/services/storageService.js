import { googleCloudClient, apiEndpoints } from './apiConfig';

/**
 * Upload file to Google Cloud Storage
 * @param {File} file - File to upload
 * @param {string} bucketName - Storage bucket name
 * @returns {Promise} - Upload result with public URL
 */
export const uploadFile = async (file, bucketName) => {
  try {
    // Convert file to base64
    const reader = new FileReader();
    const fileBase64 = await new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${file.name}`;
    
    // Prepare request payload
    const requestData = {
      name: filename,
      contentType: file.type,
      content: fileBase64
    };
    
    // Make API request
    const response = await googleCloudClient.post(
      `${apiEndpoints.storage}/${bucketName}/o`,
      requestData
    );
    
    // Process and return results
    if (response.data && response.data.name) {
      return {
        filename: response.data.name,
        contentType: response.data.contentType,
        size: response.data.size,
        publicUrl: `https://storage.googleapis.com/${bucketName}/${response.data.name}`
      };
    }
    
    throw new Error('File upload failed');
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Download file from Google Cloud Storage
 * @param {string} filename - File name to download
 * @param {string} bucketName - Storage bucket name
 * @returns {Promise} - File content
 */
export const downloadFile = async (filename, bucketName) => {
  try {
    // Make API request
    const response = await googleCloudClient.get(
      `${apiEndpoints.storage}/${bucketName}/o/${encodeURIComponent(filename)}`,
      { params: { alt: 'media' } }
    );
    
    // Return file content
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};
