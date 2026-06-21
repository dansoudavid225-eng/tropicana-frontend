import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'tropicanapiopio.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Anti-clickjacking : empêche le site d'être intégré dans une <iframe> tierce
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Empêche le navigateur de deviner le type MIME (réduit le risque XSS via upload)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Limite les infos envoyées dans l'en-tête Referer vers des sites tiers
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Désactive l'accès aux API sensibles du navigateur par défaut
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};

export default nextConfig;
