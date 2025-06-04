import React, { useState, useEffect } from 'react';
import { 
  FaUpload, 
  FaLink, 
  FaYoutube, 
  FaPodcast, 
  FaFileAlt, 
  FaFilePdf, 
  FaHeadphones, 
  FaVideo, 
  FaGraduationCap,
  FaArrowRight,
  FaCheck,
  FaSpinner,
  FaDownload,
  FaExclamationTriangle
} from 'react-icons/fa';
import { convertMedia } from './services/conversionService';
import { extractYoutubeId } from './services/apiConfig';

const OUTPUT_FORMATS = [
  { id: 'text', label: 'Text Document', icon: <FaFileAlt className="format-icon" /> },
  { id: 'pdf', label: 'eBook PDF', icon: <FaFilePdf className="format-icon" /> },
  { id: 'audio', label: 'Audio', icon: <FaHeadphones className="format-icon" /> },
  { id: 'video', label: 'Video', icon: <FaVideo className="format-icon" /> },
  { id: 'course', label: 'Training Course', icon: <FaGraduationCap className="format-icon" /> }
];

export default function App() {
  const [inputType, setInputType] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [conversionResult, setConversionResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    
    // Simulate progress updates during conversion
    if (converting) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [converting]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setInputType('file');
      setUrl(''); // Clear URL if file is selected
      setError(null); // Clear any previous errors
    }
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    
    if (inputUrl) {
      setInputType('url');
      setFile(null); // Clear file if URL is entered
      setError(null); // Clear any previous errors
    } else {
      setInputType('');
    }
  };

  const handleConvert = async () => {
    try {
      setConverting(true);
      setError(null);
      setConversionResult(null);
      
      // Validate input
      if (inputType === 'url' && !url) {
        throw new Error('Please enter a valid URL');
      } else if (inputType === 'file' && !file) {
        throw new Error('Please upload a file');
      } else if (!outputFormat) {
        throw new Error('Please select an output format');
      }
      
      // For YouTube URLs, validate the video ID
      if (inputType === 'url' && (url.includes('youtube.com') || url.includes('youtu.be'))) {
        const videoId = extractYoutubeId(url);
        if (!videoId) {
          throw new Error('Invalid YouTube URL');
        }
      }
      
      // Perform the conversion
      const result = await convertMedia(
        inputType,
        inputType === 'url' ? url : file,
        outputFormat,
        {
          translate: false, // Set to true if translation is needed
          store: true // Store the result for download
        }
      );
      
      // Set the conversion result
      setConversionResult(result);
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.message || 'An error occurred during conversion');
    } finally {
      setConverting(false);
    }
  };

  const getUrlIcon = () => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <FaYoutube />;
    } else if (url.includes('podcast') || url.includes('.mp3') || url.includes('.wav')) {
      return <FaPodcast />;
    }
    return <FaLink />;
  };

  const handleDownload = () => {
    if (!conversionResult) return;
    
    // Create a download link
    const blob = new Blob([conversionResult.content], { type: conversionResult.contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${Date.now()}.${getFileExtension(outputFormat)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (format) => {
    switch (format) {
      case 'text': return 'txt';
      case 'pdf': return 'pdf';
      case 'audio': return 'mp3';
      case 'video': return 'mp4';
      case 'course': return 'json';
      default: return 'txt';
    }
  };

  return (
    <div className="container">
      <div className="app-header">
        <h1 className="app-title">Universal Media Converter</h1>
        <p className="app-subtitle">
          Transform any content into your preferred format with enterprise-grade conversion technology
        </p>
      </div>
      
      <div className={`input-section ${animationClass}`}>
        <div className="step-indicator">
          <div className="step-number">1</div>
          <div className="step-title">Choose Input Source</div>
        </div>
        
        <div className="input-options">
          <label className="input-option">
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <FaUpload />
            <span>Upload File</span>
          </label>

          <div className="url-form">
            <div className="url-input-group">
              <div className="url-input-icon">
                <FaLink />
              </div>
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="Paste URL (YouTube, podcast, blog, website, social media, etc.)"
                className="url-input"
              />
            </div>
          </div>
        </div>

        {(file || url) && (
          <div className="source-preview animate-fade-in">
            <h3>
              <FaCheck />
              Selected Source:
            </h3>
            {file && (
              <p>
                <FaUpload />
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {url && (
              <p>
                {getUrlIcon()}
                {url}
              </p>
            )}
          </div>
        )}
      </div>

      {(file || url) && (
        <div className={`output-section ${animationClass} delay-100`}>
          <div className="step-indicator">
            <div className="step-number">2</div>
            <div className="step-title">Choose Output Format</div>
          </div>
          
          <div className="format-options">
            {OUTPUT_FORMATS.map(format => (
              <label key={format.id} className={`format-option ${outputFormat === format.id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="outputFormat"
                  value={format.id}
                  checked={outputFormat === format.id}
                  onChange={(e) => setOutputFormat(e.target.value)}
                />
                <div className="format-option-icon">
                  {format.icon}
                </div>
                <span className="format-option-label">{format.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {outputFormat && (
        <div className={`convert-button-container ${animationClass} delay-200`}>
          <button
            className="convert-button"
            onClick={handleConvert}
            disabled={converting}
          >
            {converting ? (
              <>
                <FaSpinner className="loading" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <FaArrowRight />
                <span>Convert Now</span>
              </>
            )}
          </button>
          
          {converting && (
            <div className="progress-container animate-fade-in">
              <div className="progress-bar">
                <div 
                  className="progress-value" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-status">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="error-container animate-fade-in">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}
          
          {conversionResult && (
            <div className="result-container animate-fade-in">
              <h3>
                <FaCheck />
                Conversion Complete!
              </h3>
              <p>Your {OUTPUT_FORMATS.find(f => f.id === outputFormat)?.label} is ready.</p>
              <button className="download-button" onClick={handleDownload}>
                <FaDownload />
                <span>Download Result</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
