/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.js', 'page.tsx'], // only files with these extensions will be built as pages
}

module.exports = nextConfig
