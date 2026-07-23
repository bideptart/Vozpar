/** @type {import('next').NextConfig} */
const nextConfig = {
  // `standalone` outputs a self-contained `.next/standalone` folder that ships
  // its own `node_modules`. Drop it on any Node 18+ host (Hostinger, VPS,
  // Docker, etc.) and run `node server.js` — no Vercel runtime required.
  output: "standalone",
  devIndicators: false,
  // Lets HMR/dev assets load when you open the site via the LAN IP
  // (e.g. http://192.168.2.68:3000) instead of localhost.
  allowedDevOrigins: ["192.168.2.68"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
