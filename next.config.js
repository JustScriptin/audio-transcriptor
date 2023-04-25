const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add the plugin to both the server and client configurations
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false // patch for fluent-ffmpeg
      })
    );

    // Enable polling-based file watching for hot reloading inside a Docker container
    config.watchOptions = {
      poll: 800,
      aggregateTimeout: 300,
    };

    return config;
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;