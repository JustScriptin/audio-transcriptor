This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Running Dev Environment with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.
- [Visual Studio Code](https://code.visualstudio.com/) installed.
- [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed in Visual Studio Code.

### Steps

0. Start Docker Desktop.
1. Open the project folder in Visual Studio Code.
2. Press `F1` to open the command palette and type "Remote-Containers: Reopen in Container" to open the project in the development container. Visual Studio Code will build the Docker image based on the Dockerfile and start the container.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
