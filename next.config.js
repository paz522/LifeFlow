/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [];
  },
  webpack(config) {
    return config;
  },
}

module.exports = nextConfig; 