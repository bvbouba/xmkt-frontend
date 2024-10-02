/** @type {import('next').NextConfig} */
module.exports = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/admin',
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
};
