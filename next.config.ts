import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http', 
        hostname: 'minio-api',
        port: '9000',
        pathname: '/resources/**', 
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/resources/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',   
      }
    ],
  },
};

export default nextConfig;
