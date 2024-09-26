/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/my-portfolio', // Replace with your repository name
  images: {
    unoptimized: true,
  },
};

export default nextConfig;