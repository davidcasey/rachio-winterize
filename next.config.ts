const isProd = process.env.NODE_ENV === 'production';
const repoName = 'rachio-winterize';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig;
