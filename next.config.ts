import type { NextConfig } from "next";

type ImagePattern = {
  protocol: 'http' | 'https';
  hostname: string;
  pathname: string;
};

function parsePatternFromEnv(envVar: string | undefined): ImagePattern | null {
  if (!envVar) return null;
  try {
    const u = new URL(envVar);
    return {
      protocol: u.protocol.replace(":", "") as 'http' | 'https',
      hostname: u.hostname,
      pathname: "/**", // allow any path from this origin (includes query strings)
    };
  } catch {
    return null;
  }
}

// 1) API origin (if you ever serve images from API /media)
const apiPattern = parsePatternFromEnv(process.env.NEXT_PUBLIC_API_URL) || {
  protocol: "http" as const,
  hostname: "localhost",
  pathname: "/**",
};

// 2) Media CDN/S3 origin - parse from NEXT_PUBLIC_MEDIA_BASE_URL if available
const mediaPattern = parsePatternFromEnv(process.env.NEXT_PUBLIC_MEDIA_BASE_URL);

// 3) Build S3 patterns from bucket name if available
const bucketName = process.env.NEXT_PUBLIC_AWS_STORAGE_BUCKET_NAME;
const s3Region = process.env.NEXT_PUBLIC_AWS_S3_REGION_NAME || 'us-east-1';

// Create an array to hold all remote patterns
const remotePatterns = [
  apiPattern,
  // Local dev fallbacks
  { protocol: "http" as const, hostname: "127.0.0.1", pathname: "/**" },
  { protocol: "http" as const, hostname: "localhost", pathname: "/**" },
];

// Add media pattern if parsed from env
if (mediaPattern) {
  remotePatterns.push(mediaPattern);
}

// Add S3-specific patterns if bucket name is available
if (bucketName) {
  // Standard S3 URL format: bucket-name.s3.amazonaws.com
  remotePatterns.push({
    protocol: "https" as const,
    hostname: `${bucketName}.s3.amazonaws.com`,
    pathname: "/**",
  });
  
  // Region-specific S3 URL format: bucket-name.s3.region.amazonaws.com
  remotePatterns.push({
    protocol: "https" as const,
    hostname: `${bucketName}.s3.${s3Region}.amazonaws.com`,
    pathname: "/**",
  });
}

// Fallback wildcard patterns for S3 (less secure but ensures compatibility)
remotePatterns.push(
  { protocol: "https" as const, hostname: "*.s3.amazonaws.com", pathname: "/**" },
  { protocol: "https" as const, hostname: "*.s3.*.amazonaws.com", pathname: "/**" }
);

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
