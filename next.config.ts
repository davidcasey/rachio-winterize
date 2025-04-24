import type { NextConfig } from "next";

const repoName = "rachio-winterize"; // This should match your repo name on GitHub

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  trailingSlash: true,
  output: 'export',
};

export default nextConfig;
