'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/articles', label: '文章' },
  { href: '/podcasts', label: '播客' },
  { href: '/about', label: '关于' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="nav">
      <Link href="/" className="logo">
        声波之间
      </Link>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link 
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.5rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%);
        }
        
        .logo {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--accent-warm);
          letter-spacing: 0.05em;
        }
        
        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }
        
        .nav-links a {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 0.3s ease;
          padding-bottom: 2px;
          border-bottom: 1px solid transparent;
        }
        
        .nav-links a:hover,
        .nav-links a.active {
          color: var(--accent-warm);
        }
        
        .nav-links a.active {
          border-bottom-color: var(--accent-warm);
        }

        @media (max-width: 768px) {
          .nav {
            padding: 1rem 1.5rem;
          }
          
          .nav-links {
            gap: 1.5rem;
          }
          
          .nav-links a {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </nav>
  )
}