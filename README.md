# Channel Analyzer

AI-powered YouTube channel analysis tool that extracts topics, generates video ideas, and aggregates relevant news and discussions.

## Description

Channel Analyzer is a Next.js application that analyzes YouTube channels to provide comprehensive insights for content creators. The application performs the following tasks:

- Fetches and analyzes recent videos from a YouTube channel
- Extracts main topics using OpenAI GPT-4
- Searches for relevant news articles related to identified topics
- Aggregates Reddit discussions for each topic
- Generates AI-powered video ideas based on analysis results

## Tech Stack

- Next.js 16.0.3
- React 19.2.0
- TypeScript
- Tailwind CSS v4
- OpenAI API
- YouTube Data API v3
- NewsAPI
- Reddit API

## Prerequisites

- Node.js 20.9.0 or higher
- Yarn package manager
- API Keys:
  - OpenAI API Key
  - YouTube Data API Key
  - NewsAPI Key

## Installation

Clone the repository:

```bash
git clone https://github.com/denred/channel-generator.git
cd channel-generator
```

Install dependencies:

```bash
yarn install
```

Create environment configuration file `.env.local` in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
YOUTUBE_API_KEY=your_youtube_api_key
NEWSAPI_KEY=your_newsapi_key
```

## Running the Application

### Development Mode

Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build production bundle
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Run ESLint with auto-fix
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn type-check` - Run TypeScript type checking

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── analyze/          # Analysis API endpoint
│   ├── components/           # React components
│   └── page.tsx              # Main page
├── config/                   # Configuration files
├── hooks/                    # Custom React hooks
├── libs/                     # Constants and enums
├── services/                 # External API integrations
│   ├── news/                 # News API services
│   ├── openai/               # OpenAI services
│   ├── reddit/               # Reddit API services
│   └── youtube/              # YouTube API services
├── types/                    # TypeScript type definitions
└── utils/                    # Utility functions
```

## Features

### Channel Analysis

Input a YouTube channel URL to analyze the channel's content strategy and receive:

- Topic extraction from recent videos
- Confidence scores for identified topics
- Latest videos with metadata

### Content Discovery

- Relevant news articles for each identified topic
- Reddit discussions and posts
- Aggregated data from multiple sources

### AI-Powered Insights

- Video idea generation based on channel analysis
- Topic suggestions with concept descriptions
- Thumbnail design recommendations

### User Interface

- Dark/Light theme support with system preference detection
- Responsive design for mobile and desktop
- Tab-based navigation for different result sections
- Real-time analysis progress tracking

## API Endpoints

### POST /api/analyze

Analyzes a YouTube channel and returns comprehensive insights.

Request body:

```json
{
  "channelUrl": "https://www.youtube.com/channel/CHANNEL_ID"
}
```

Response:

```json
{
  "status": 200,
  "channelId": "string",
  "channelName": "string",
  "lastVideos": [],
  "topics": {},
  "news": [],
  "reddit": [],
  "ideas": []
}
```

## Troubleshooting

### Reddit API Issues on Production

If you encounter issues with Reddit API on production (e.g., Vercel, Netlify), the following improvements have been implemented:

**Problem**: Reddit's public API may block requests from certain IP ranges or due to rate limiting.

**Solutions implemented**:

1. **Enhanced User-Agent**: Uses a full browser User-Agent string instead of a simple bot identifier
2. **Retry Logic**: Automatic retry with exponential backoff (up to 2 retries)
3. **Rate Limit Handling**: Special handling for 429 (Too Many Requests) responses with longer wait times
4. **Graceful Degradation**: Application continues to work even if Reddit API fails
5. **Consecutive Failure Detection**: Stops making requests after 2 consecutive failures to avoid wasting time
6. **Request Timeout**: 10-second timeout to prevent hanging requests
7. **Delay Between Requests**: 3-second delay between Reddit API calls

**Additional Headers**:

- `Accept: application/json`
- `Accept-Language: en-US,en;q=0.9`
- `Cache-Control: no-cache`
- `Pragma: no-cache`

If Reddit API continues to fail, consider:

- Using Reddit's official OAuth API (requires Reddit app credentials)
- Implementing a caching layer
- Using a proxy service
- Rate limiting on the application level

## License

This project is private and proprietary.

## Contributing

This is a private project. Contributions are not accepted at this time.
