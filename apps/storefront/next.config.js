/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

module.exports = {
  webpack: (config, { isServer }) => {
    // Resolve TypeScript extensions
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
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  i18n,
};


