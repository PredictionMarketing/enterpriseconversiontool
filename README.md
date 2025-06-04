# Universal Media Converter

A professional web application for converting various media formats using Google Cloud APIs.

## Features

- Convert YouTube videos to text, PDF, audio, or training courses
- Process audio files for transcription
- Convert documents to different formats
- Generate training courses from content
- Professional, enterprise-grade UI

## Google APIs Used

- YouTube Data API v3
- Google Cloud Speech-to-Text
- Google Cloud Text-to-Speech
- Google Cloud Translation
- Google Cloud Document AI
- Google Cloud Storage

## Setup

1. Create a `.env` file with your Google API keys:
   ```
   VITE_GOOGLE_API_KEY=your_api_key_here
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Start the development server:
   ```
   pnpm run dev
   ```

## API Integration

The application integrates with Google Cloud APIs to provide comprehensive media conversion capabilities:

- **YouTube Data API**: Extract video metadata and captions
- **Speech-to-Text**: Transcribe audio content
- **Text-to-Speech**: Generate audio from text
- **Translation**: Support multilingual content
- **Document AI**: Process documents and extract structured data
- **Cloud Storage**: Store and retrieve conversion results

## Usage

1. Choose an input source (file upload or URL)
2. Select the desired output format
3. Click "Convert Now" to process the media
4. Download the converted result
