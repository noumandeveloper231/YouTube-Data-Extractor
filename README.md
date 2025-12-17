# YouTube Metadata Extractor

A modern Next.js application that extracts comprehensive metadata from YouTube videos using the YouTube Data API v3.

## Features

- **Complete Metadata Extraction**: Get title, description, thumbnails, tags, statistics, and technical details
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Real-time Processing**: Fast API responses with loading states
- **Error Handling**: Comprehensive error handling and user feedback
- **Multiple URL Formats**: Supports various YouTube URL formats

## Extracted Data

- **Basic Info**: Title, description, channel name, publish date
- **Statistics**: View count, like count, comment count
- **Media**: High-quality thumbnails in multiple resolutions
- **Technical**: Video duration, definition (HD/SD), captions availability
- **Metadata**: Tags, category, language information

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Get YouTube Data API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the API key to YouTube Data API v3 for security

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your YouTube API key to `.env.local`:
   ```
   YOUTUBE_API_KEY=your_actual_api_key_here
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. Enter a YouTube video URL in any of these formats:
   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`
   - `https://www.youtube.com/embed/VIDEO_ID`

2. Click "Extract Metadata" to fetch the video information

3. View the comprehensive metadata including:
   - Video thumbnail and basic info
   - Description and tags
   - View counts and engagement metrics
   - Technical specifications

## API Endpoints

### POST `/api/youtube`

Extracts metadata from a YouTube video URL.

**Request Body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "VIDEO_ID",
    "title": "Video Title",
    "description": "Video description...",
    "channelTitle": "Channel Name",
    "thumbnails": {
      "high": "https://...",
      "medium": "https://..."
    },
    "tags": ["tag1", "tag2"],
    "statistics": {
      "viewCount": "1000000",
      "likeCount": "50000",
      "commentCount": "1000"
    }
  }
}
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TailwindCSS 4** - Styling
- **Lucide React** - Icons
- **YouTube Data API v3** - Video metadata

## Project Structure

```
├── app/
│   ├── api/youtube/route.js    # API endpoint for YouTube metadata
│   ├── page.js                 # Main application page
│   ├── layout.js              # Root layout
│   └── globals.css            # Global styles
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## Error Handling

The application handles various error scenarios:
- Invalid YouTube URLs
- Videos that don't exist or are private
- API rate limiting
- Network connectivity issues
- Missing API key configuration

## Security Notes

- API keys are stored in environment variables
- The `.env.local` file is gitignored by default
- Consider implementing rate limiting for production use
- Restrict your YouTube API key to specific domains in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
