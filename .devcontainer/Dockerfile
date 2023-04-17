FROM node:18

# Set the working directory inside /workspaces directory
WORKDIR /workspaces/audio-transcriptor

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Update the package index and install FFmpeg
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ffmpeg && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*
