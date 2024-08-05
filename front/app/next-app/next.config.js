/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  // 本番環境の場合のみ assetPrefix を設定
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 2000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;
