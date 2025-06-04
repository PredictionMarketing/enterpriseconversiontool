import { convertYoutubeToText } from './youtubeService';

/**
 * Get file extension based on output format
 * @param {string} format - Output format (text, pdf, audio, video, course)
 * @returns {string} - File extension
 */
export const getFileExtension = (format) => {
  const extensions = {
    text: 'txt',
    pdf: 'pdf',
    audio: 'mp3',
    video: 'mp4',
    course: 'html'
  };
  
  return extensions[format] || 'txt';
};

/**
 * Convert media from one format to another
 * @param {string} inputType - Type of input (url, file)
 * @param {string|File} input - Input URL or file
 * @param {string} outputFormat - Desired output format
 * @param {Object} options - Additional conversion options
 * @returns {Promise} - Conversion result
 */
export const convertMedia = async (inputType, input, outputFormat, options = {}) => {
  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let content = '';
    let metadata = {};
    
    // Process input based on type
    if (inputType === 'url') {
      const url = input;
      
      // Handle YouTube URLs
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const youtubeData = await convertYoutubeToText(url);
        content = youtubeData.transcript;
        metadata = {
          title: youtubeData.title,
          source: 'YouTube',
          author: youtubeData.channelTitle,
          thumbnail: youtubeData.thumbnailUrl
        };
      } else {
        // For demo purposes, generate placeholder content for other URLs
        content = `Content extracted from: ${url}\n\nThis is placeholder content for demonstration purposes. In a production environment, this would contain the actual content extracted from the URL.`;
        metadata = {
          title: 'URL Content',
          source: url
        };
      }
    } else if (inputType === 'file') {
      // For demo purposes, generate placeholder content for files
      const file = input;
      content = `Content extracted from file: ${file.name}\n\nThis is placeholder content for demonstration purposes. In a production environment, this would contain the actual content extracted from the file.`;
      metadata = {
        title: file.name,
        source: 'File Upload',
        type: file.type,
        size: file.size
      };
    }
    
    // Apply options
    if (options.summarize) {
      content = `[SUMMARY]\n${content.substring(0, content.length / 3)}\n\nThis content has been summarized for brevity.`;
    }
    
    if (options.translate && options.targetLanguage) {
      content = `[TRANSLATED TO ${options.targetLanguage.toUpperCase()}]\n${content}\n\nNote: This is a simulation of translation. In a production environment, this would be properly translated to ${options.targetLanguage}.`;
    }
    
    // Format output based on selected format
    let formattedContent = '';
    let contentType = '';
    
    switch (outputFormat) {
      case 'text':
        formattedContent = content;
        contentType = 'text/plain';
        break;
      case 'pdf':
        formattedContent = `PDF CONTENT\n${content}`;
        contentType = 'application/pdf';
        break;
      case 'audio':
        formattedContent = `AUDIO CONTENT\n${content}`;
        contentType = 'audio/mpeg';
        break;
      case 'video':
        formattedContent = `VIDEO CONTENT\n${content}`;
        contentType = 'video/mp4';
        break;
      case 'course':
        formattedContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Training Course: ${metadata.title || 'Converted Content'}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; }
    .module { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
    .module h2 { margin-top: 0; color: #1f2937; }
  </style>
</head>
<body>
  <h1>Training Course: ${metadata.title || 'Converted Content'}</h1>
  <p><strong>Source:</strong> ${metadata.source || 'Unknown'}</p>
  
  <div class="module">
    <h2>Module 1: Introduction</h2>
    <p>${content.substring(0, content.length / 3)}</p>
  </div>
  
  <div class="module">
    <h2>Module 2: Core Concepts</h2>
    <p>${content.substring(content.length / 3, 2 * content.length / 3)}</p>
  </div>
  
  <div class="module">
    <h2>Module 3: Advanced Topics</h2>
    <p>${content.substring(2 * content.length / 3)}</p>
  </div>
</body>
</html>
        `;
        contentType = 'text/html';
        break;
      default:
        formattedContent = content;
        contentType = 'text/plain';
    }
    
    return {
      content: formattedContent,
      contentType,
      metadata
    };
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`Conversion failed: ${error.message}`);
  }
};
