const isProd = process.env.NODE_ENV === 'production';
const repoName = 'rachio-winterize';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Ensure we're using static export
  basePath: isProd ? `/${repoName}` : '', // Base path for production
  assetPrefix: isProd ? `/${repoName}/` : '', // Prefix for assets in production
  trailingSlash: true, // Ensure trailing slashes are used
};

module.exports = nextConfig;