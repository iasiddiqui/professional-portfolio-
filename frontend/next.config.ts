import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseImageHostnames(): string[] {
  const configured = process.env.NEXT_PUBLIC_IMAGE_HOSTS;
  if (configured) {
    return configured.split(',').map((host) => host.trim()).filter(Boolean);
  }

  try {
    const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1');
    return [apiUrl.hostname];
  } catch {
    return ['localhost'];
  }
}

const imageHostnames = parseImageHostnames();

function getApiOrigin(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/api\/v1\/?$/, '');
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    const apiOrigin = getApiOrigin();
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      ...imageHostnames.flatMap((hostname) => [
        {
          protocol: 'http' as const,
          hostname,
          ...(hostname === 'localhost' ? { port: '4000' } : {}),
          pathname: '/uploads/**',
        },
        {
          protocol: 'https' as const,
          hostname,
          pathname: '/uploads/**',
        },
      ]),
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
