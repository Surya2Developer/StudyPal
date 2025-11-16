
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Fix for "node:" imports in dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      "node:module": "module",
      "node:fs": "fs",
      "node:path": "path",
      "node:url": "url",
    };

    return config;
  },
};

export default nextConfig;