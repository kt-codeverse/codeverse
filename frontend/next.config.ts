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
    // Allow Cloudinary as an external image host
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
    unoptimized: true,
  },
  env: {
    API_URL: process.env.API_URL,
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:8080/api/:path*', // 백엔드 서버 주소
  //     },
  //   ];
  // },
};

export default nextConfig;
