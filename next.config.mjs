/** @type {import('next').NextConfig} */
const nextConfig = {
  // `standalone` outputs a self-contained `.next/standalone` folder that ships
  // its own `node_modules`. Drop it on any Node 18+ host (Hostinger, VPS,
  // Docker, etc.) and run `node server.js` — no Vercel runtime required.
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
