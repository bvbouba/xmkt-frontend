/** @type {import('next').NextConfig} */

import pkg from './next-i18next.config.js';  // Note the '.js' extension
const { i18n } = pkg;



const nextConfig = {
  reactStrictMode: true,
  i18n,
};

export default nextConfig;
