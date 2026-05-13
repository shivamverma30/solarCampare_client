/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // include configured qualities used by Image components
    qualities: [75, 90],
  },
}

module.exports = nextConfig
