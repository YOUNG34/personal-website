import './globals.css'
import type { Metadata } from 'next'
import VisitorPopup from '@/components/VisitorPopup'

// 预加载访客数（服务端）
async function getInitialVisitors() {
  try {
    const response = await fetch('http://localhost:3000/api/visitors')
    const data = await response.json()
    return data.visitors || 1688
  } catch {
    return 1688
  }
}

export const metadata: Metadata = {
  title: "Owen's Notebook",
  description: '用文字记录生活的点滴，分享思考与感悟',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialVisitors = await getInitialVisitors()
  
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <VisitorPopup initialVisitors={initialVisitors} />
      </body>
    </html>
  )
}