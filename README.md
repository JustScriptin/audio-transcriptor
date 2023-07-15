# Audio Transcriptor and Text Summarizer

## Overview

This project provides an interface for transcribing audio files to text and summarizing blocks of text using AI. The app allows you to easily:

- Upload an audio file or mp4 and have it transcribed to text using automatic speech recognition
- Upload a text file and have key points summarized using AI text summarization
- Download transcripts and summaries for review and use  

The project demonstrates using Next.js, React, TypeScript, and Docker to build a full-stack web application with a great developer experience.

### Key Features

- **Audio Transcription** - Upload common audio formats and mp4 like .wav, .mp3, etc and leverage AI to convert speech to text 
- **Text Summarization** - Upload text files and summarize the key points using AI 
- **Download Files** - Get transcriptions and summaries as text files to use however needed
- **Local Dev Environment** - Containerized dev environment using Docker ensures consistency across local and production
- **Code Formatting** - ESLint handles code linting and formatting for clean, consistent code

### Tech Stack

- **[Next.js](https://nextjs.org/)** - React framework for server-rendered apps
- **[React](https://reactjs.org/)** - Library for building user interfaces  
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing for JavaScript
- **[Docker](https://www.docker.com/)** - Containerization for consistent environments
- **[ESLint](https://eslint.org/)** - Linter for clean code
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg)** - Audio/video file conversion
- **[OpenAI Whisper](https://openai.com/blog/whisper/)** - Speech recognition API
- **[OpenAI GPT-3](https://platform.openai.com/)** - Large language model API for summarization 
- **[@dqbd/tiktoken](https://www.npmjs.com/package/@dqbd/tiktoken)** - Token counter for GPT-3

## File Structure

- **`pages/api`** - API routes for transcribing and summarizing
- **`components`** - Reusable React components like the file uploader
- **`lib`** - Helper and shared utility functions 
- **`constants`** - Constants for API keys, prompts, etc

## Getting Started

### Run Locally with Docker

1. Clone the repository
2. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
3. Open the repo in [VS Code](https://code.visualstudio.com/)
4. Install the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
5. Start Docker Desktop
6. Reopen the project in a Container when prompted or run the command after pressing `f1` "Remote-Containers: Reopen in Container" or "Dev Container: Reopen in container" if the former doesn't show up
7. Docker will start the Next.js app and API server - Changes will hot reload

### Local Development

- `npm run dev` - Start the Next.js dev server
- `npm run build` - Create a production build
- `npm run start` - Start the Node.js server
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Run ESLint with auto-fixing

### Contributions

Contributions are welcome! Please open an issue or create a pull request. Some ideas:

- Support more audio formats for transcription  
- Try different speech recognition APIs
- Improve prompts for the AI summarizer 
- Add tests
- Improve documentation
- Fix bugs

### License

This project is licensed under the MIT license - see [LICENSE.md](LICENSE.md) for details.