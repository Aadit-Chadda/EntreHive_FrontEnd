import type { NextConfig } from "next";

// Parse backend URL for image configuration
const getBackendImageConfig = () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const url = new URL(backendUrl);
    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? '443' : '80'),
      pathname: '/media/**',
    };
  } catch (error) {
    console.warn('Failed to parse NEXT_PUBLIC_API_URL, using defaults:', error);
    return {
      protocol: 'http' as const,
      hostname: 'localhost',
      port: '8000',
      pathname: '/media/**',
    };
  }
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Primary backend URL from environment
      getBackendImageConfig(),
      // Fallback patterns for local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
