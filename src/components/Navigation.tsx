import Link from 'next/link'
import LikeButton from '@/components/LikeButton'
import '../app/styles.css'

// 预加载点赞数（服务端）
async function getInitialLikes() {
  try {
    const response = await fetch('http://localhost:3000/api/likes')
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