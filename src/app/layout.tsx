import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '声波之间 | 个人空间',
  description: '在声音里遇见故事，在文字中记录思考',
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