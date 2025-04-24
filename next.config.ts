import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = "rachio-winterize";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isProd && {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
    trailingSlash: true,
  }),
};

export default nextConfig;
