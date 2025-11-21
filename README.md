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

If you encounter issues with Reddit API on production (e.g., Vercel, Netlify), the application has multiple fallback mechanisms:

**Problem**: Reddit's public API may block requests from certain hosting providers' IP ranges or due to rate limiting.

**Solutions implemented**:

1. **Old Reddit Endpoint**: Uses `old.reddit.com` which is more stable and less restrictive
2. **Enhanced Headers**: Full browser-like headers including `User-Agent`, `Accept`, `Sec-Fetch-*` headers
3. **Retry Logic**: Automatic retry with exponential backoff (up to 2 retries)
4. **Rate Limit Handling**: Special handling for 429 (Too Many Requests) responses with 5s+ wait times
5. **Graceful Degradation**: Application continues to work even if Reddit API fails completely
6. **Fast Fail**: Stops making requests after first failure to avoid wasting time on production
7. **Request Timeout**: 15-second timeout to prevent hanging requests
8. **Delay Between Requests**: 3-second delay between Reddit API calls
9. **Environment Variable Control**: Can disable Reddit completely via `ENABLE_REDDIT=false`

**To disable Reddit on production** (if it continues to fail):

Add this environment variable to your hosting platform (Vercel, Netlify, etc.):

```bash
ENABLE_REDDIT=false
```

This will make the application skip Reddit API calls entirely while keeping all other functionality working.

**Debugging on Production**:

The application now includes comprehensive logging for Reddit API issues:

1. Check your hosting platform's logs (e.g., Vercel Dashboard → Your Project → Logs)
2. Look for log entries with these keys:
   - `Reddit search configuration` - Shows if Reddit is enabled and environment details
   - `Reddit API Request Starting` - Shows the request URL and attempt number
   - `Reddit API Error` - Shows HTTP status, error text, and response headers
   - `Reddit API Request Failed` - Shows error details and retry information
   - `Reddit API Success` - Confirms successful requests

3. Common issues to check:
   - Status 403 or 429: Reddit is blocking your server's IP
   - Timeout errors: Network connectivity issues
   - Invalid JSON: Reddit returning HTML instead of JSON (check response headers)

If you see `"Reddit search disabled"` in logs but want it enabled, make sure `ENABLE_REDDIT` is NOT set to `"false"`.

**Alternative solutions** if Reddit continues to fail:

- Use Reddit's official OAuth API (requires Reddit app credentials)
- Implement a caching/proxy layer
- Use a third-party Reddit API service
- Self-host with a different IP range

## License

This project is private and proprietary.

## Contributing

This is a private project. Contributions are not accepted at this time.
