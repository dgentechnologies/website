
import path from 'path';
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(process.cwd(), 'src'),
    };
    return config;
  },
  /* config options here */
  env: {
    NEXT_PUBLIC_FIREBASE_DATABASE_ID:
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_WEBSITE_DATABASE_ID ||
      process.env.FIREBASE_WEBSITE_DATABASE_ID ||
      process.env.FIREBASE_DATABASE_ID ||
      '(default)',
  },
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  async redirects() {
    return [
      {
        source: '/products/auralis',
        destination: '/products/auralis-ecosystem',
        permanent: true,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
