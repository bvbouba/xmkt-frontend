/** @type {import('next').NextConfig} */

import pkg from './next-i18next.config.js';  // Note the '.js' extension
const { i18n } = pkg;

const nextConfig = {
  reactStrictMode: true,
  i18n,

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add TypeScript extensions
    config.resolve.extensions.push('.ts', '.tsx');

    // Add TypeScript loader
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    });

    return config;
  },
};

export default nextConfig;