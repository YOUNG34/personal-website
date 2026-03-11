import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Owen's Notebook",
  description: '用文字记录生活的点滴，分享思考与感悟',
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