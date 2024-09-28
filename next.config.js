/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['public.blob.vercel-storage.com'],
  },
  webpack: (config) => {
       config.resolve.alias.canvas = false;
    
       return config;
     },
}

module.exports = nextConfig
