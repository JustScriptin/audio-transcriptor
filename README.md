# Audio Transcriptor and Text Summarizer

## Overview

This project provides an interface for transcribing audio files to text and summarizing blocks of text using AI. The app allows you to easily:

- Upload an audio file or mp4 and have it transcribed to text using automatic speech recognition
- Upload a text file and have key points summarized using AI text summarization
- Download transcripts and summaries for review and use  

The project demonstrates using Next.js, React, TypeScript, and Docker to build a full-stack web application with a great developer experience.

### Demo

Watch the demo video [![Watch the demo](https://image.shutterstock.com/image-vector/play-button-icon-isolated-media-260nw-1155910950.jpg)](https://streamable.com/zee6qw) to see the application in action!

### Key Features

- **Audio Transcription** - Upload common audio formats and mp4 like .wav, .mp3, etc and leverage AI to convert speech to text 
- **Text Summarization** - Upload text files and summarize the key points using AI 
- **Download Files** - Get transcriptions and summaries as text files to use however needed
- **Local Dev Environment** - Containerized dev environment using Docker ensures consistency across local and production
- **Code Formatting** - ESLint handles code linting and formatting for clean, consistent code

### Tech Stack

- **[Next.js](https://nextjs.org/)** - React framework for server-rendered apps
- **[React](https://reactjs.org/)** - Library for building user interfaces  
- **[React-DOM](https://reactjs.org/docs/react-dom.html)** - React package for working with the DOM
- **[fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg)** - Wrapper around ffmpeg, for converting multimedia files
- **[form-data](https://www.npmjs.com/package/form-data)** - A module to create readable "multipart/form-data" streams. Can be used to submit forms and file uploads to other web applications
- **[node-fetch](https://www.npmjs.com/package/node-fetch)** - A light-weight module that brings window.fetch to Node.js. Used to send form-data to the server
- **[react-dropzone](https://www.npmjs.com/package/react-dropzone)** - Simple HTML5 drag-drop zone with React.js. Used to create a drag and drop file upload component
- **[recoil](https://recoiljs.org/)** - Recoil is an state management library for React apps
- **[uuid](https://www.npmjs.com/package/uuid)** - Simple, fast generation of RFC4122 UUIDS
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing for JavaScript
- **[Docker](https://www.docker.com/)** - Containerization for consistent environments
- **[ESLint](https://eslint.org/)** - Linter for clean code
- **[Vercel](https://vercel.com/)** - Deployment platform

### Dev Dependencies

- **[@types/fluent-ffmpeg](https://www.npmjs.com/package/@types/fluent-ffmpeg)** - Type definitions for fluent-ffmpeg
- **[@types/node](https://www.npmjs.com/package/@types/node)** - Type definitions for Node.js
- **[@types/react](https://www.npmjs.com/package/@types/react)** - Type definitions for React
- **[@types/react-dom](https://www.npmjs.com/package/@types/react-dom)** - Type definitions for React DOM
- **[@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)** - TypeScript parser for ESLint
- **[eslint](https://eslint.org/)** - A fully pluggable tool for identifying and reporting on patterns in JavaScript
- **[eslint-config-next](https://www.npmjs.com/package/eslint-config-next)** - ESLint config for Next.js
- **[eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)** - This plugin intends to support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names. Used to sort imports alphabetically
- **[sass](https://sass-lang.com/)** - Professional-grade CSS extension language
- **[TypeScript](https://www.typescriptlang.org/)** - TypeScript is a language for application scale JavaScript development

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