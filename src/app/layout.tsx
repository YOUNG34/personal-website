import './globals.css'
import type { Metadata } from 'next'
import { Noto_Serif_SC, Inter } from 'next/font/google'

const notoSerif = Noto_Serif_SC({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif'
})

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans'
})

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
    <html lang="zh-CN" className={`${notoSerif.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}