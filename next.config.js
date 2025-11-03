/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
