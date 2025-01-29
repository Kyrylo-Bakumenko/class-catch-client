/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    // images: { unoptimized: true },
    env: {
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    },
  };

export default nextConfig;
