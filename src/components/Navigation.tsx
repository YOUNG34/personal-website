import Link from 'next/link'
import '../app/styles.css'

export default function Navigation() {
  return (
    <nav className="nav">
      <Link href="/" className="navLogo">
        声波之间
      </Link>
      
      <ul className="navLinks">
        <li><Link href="/podcasts">播客</Link></li>
        <li><Link href="/articles">文章</Link></li>
        <li><Link href="/about">关于</Link></li>
      </ul>
    </nav>
  )
}