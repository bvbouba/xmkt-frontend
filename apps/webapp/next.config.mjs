/** @type {import('next').NextConfig} */

import pkg from './next-i18next.config.js';  // Note the '.js' extension
const { i18n } = pkg;

const nextConfig = {
  reactStrictMode: true,
  i18n,
  
  webpack: (config, { isServer }) => {
    config.resolve.extensions.push('.ts', '.tsx');
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