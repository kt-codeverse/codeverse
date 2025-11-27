import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Optimize package imports for libraries like lucide-react
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 또는 특정 패턴: '**.domain.com'
        pathname: '/**', // 전체 경로 허용
      },
    ],
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
