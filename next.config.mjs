/** @type {import('next').NextConfig} */
const nextConfig =
  process.env['NODE_ENV'] === 'development'
    ? {}
    : {
        output: 'export',
      }

export default nextConfig
