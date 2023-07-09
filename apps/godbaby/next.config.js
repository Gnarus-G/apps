/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_R2_BUCKET_URL).hostname,
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
