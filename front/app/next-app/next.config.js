/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 本番環境の場合のみ assetPrefix を設定
  assetPrefix: process.env.NODE_ENV === "production" ? "/editor" : "",
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 5000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;
