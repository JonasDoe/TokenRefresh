import type { NextConfig } from 'next';

const imageHostNames = ['cdn.wecreate.world', 'cdn.test.we-create.io', 'cdn.dev.we-create.io'];
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: imageHostNames.map((hostname) => ({ protocol: 'https', hostname })),
  },
};

export default nextConfig;
