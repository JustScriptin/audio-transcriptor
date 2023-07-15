FROM node:18

# Set the working directory inside /app directory
WORKDIR /workspace

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the items that do not need to be regularly rebuilt. Those will be mounted as volumes
COPY next.config.js next.config.js
COPY tsconfig.json tsconfig.json
COPY .env .env
COPY env.example env.example
COPY .dockerignore .dockerignore
COPY .eslintrc.json .eslintrc.json
COPY .gitignore .gitignore
COPY .vscode .vscode
COPY .devcontainer .devcontainer
COPY next-env.d.ts next-env.d.ts
COPY README.md README.md
COPY .git .git
COPY docker-reset.sh docker-reset.sh
COPY ./constants ./constants

# Update the package index and install FFmpeg
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*