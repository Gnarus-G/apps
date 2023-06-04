/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/sign-in",
        destination: "/sign-in/email",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
