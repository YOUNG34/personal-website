import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getArticles } from '@/lib/articles'

export default function ArticlesPage() {
  const articles = getArticles()

  return (
    <>
      <Navigation />
      
      <main className="main">
        <header className="page-header">
          <p className="section-label">Articles</p>
          <h1 className="section-title">文章</h1>
          <p className="section-desc">记录思考与感悟，分享我的世界观</p>
        </header>

        <div className="articles-grid">
          {articles.length === 0 ? (
            <div className="empty-state">
              <p>暂无文章</p>
              <p className="hint">将 Markdown 文件放入 articles/ 目录即可</p>
            </div>
          ) : (
            articles.map((article) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className="article-card"
              >
                <div className="article-date">{article.date}</div>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-desc">{article.description}</p>
                <div className="read-more">
                  阅读全文 →
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      <Footer />
      
      <style jsx>{`
        .main {
          min-height: 100vh;
          padding: 8rem 3rem 4rem;
          position: relative;
          z-index: 1;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .section-label {
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent-warm);
          margin-bottom: 1rem;
        }
        
        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 1rem;
        }
        
        .section-desc {
          color: var(--text-secondary);
          font-size: 1rem;
        }
        
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .article-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.4s ease;
          display: block;
          color: inherit;
        }
        
        .article-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201, 166, 107, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .article-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }
        
        .article-title {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        
        .article-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        
        .read-more {
          font-size: 0.85rem;
          color: var(--accent-warm);
        }
        
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
        }
        
        .empty-state .hint {
          font-size: 0.85rem;
          margin-top: 0.5rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .main {
            padding: 6rem 1.5rem 3rem;
          }
          
          .articles-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}