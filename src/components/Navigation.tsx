import Link from 'next/link'
import LikeButton from '@/components/LikeButton'
import '../app/styles.css'

// 预加载点赞数（服务端）
async function getInitialLikes() {
  try {
    // 使用环境变量或相对 URL，支持本地和生产环境
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/likes`, {
      cache: 'no-store' // 禁用缓存，确保每次都获取最新数据
    })
    const data = await response.json()
    return data.likes || 1688
  } catch {
    return 1688
  }
}

export default async function Navigation() {
  const initialLikes = await getInitialLikes()
  
  return (
    <nav className="nav">
      <div className="navLikeSection">
        <LikeButton initialLikes={initialLikes} />
      </div>
      
      <Link href="/" className="navLogo">
        Owen's Notebook
      </Link>
      
      {/* 汉堡菜单 - 仅移动端显示 */}
      <div className="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <ul className="navLinks">
        <li><Link href="/articles">文章</Link></li>
        <li><Link href="/about">关于</Link></li>
      </ul>
    </nav>
  )
}