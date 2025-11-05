import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Optimize package imports for libraries like lucide-react
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    // prefer modern image formats when available
    formats: ['image/webp', 'image/avif'],
  },
}

export default nextConfig
