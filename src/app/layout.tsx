import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文字之间 | 个人空间',
  description: '用文字记录生活，分享思考与感悟',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}