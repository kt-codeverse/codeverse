import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Optimize package imports for libraries like lucide-react
    optimizePackageImports: ['lucide-react'],
  },
  // images: {
  //   formats: ['image/webp', 'image/avif'],
  //   // prefer modern image formats when available
  // },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*' }],
  },
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
