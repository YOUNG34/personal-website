/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除 output: 'export' 以支持 API 路由和 Redis
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig