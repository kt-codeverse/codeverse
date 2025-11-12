import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Optimize package imports for libraries like lucide-react
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    // prefer modern image formats when available
    formats: ['image/webp', 'image/avif'],

  remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "a0.muscache.com" },
    ],
  },
}

export default nextConfig
