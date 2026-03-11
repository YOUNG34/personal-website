import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getArticles } from '@/lib/articles'
import Link from 'next/link'
import '../styles.css'

export default function ArticlesPage() {
  const articles = getArticles()

  return (
    <>
      <Navigation />
      
      <main className="articlesMain">
        <header className="articlesHeader">
          <h1 className="articlesTitle">📚 文章</h1>
          <p className="articlesDesc">记录生活，分享思考</p>
        </header>

        <div className="articlesGrid">
          {articles.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>
              暂无文章，敬请期待...
            </p>
          ) : (
            articles.map((article) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className="articleCard"
              >
                <p className="articleCardDate">{article.date}</p>
                <h2 className="articleCardTitle">{article.title}</h2>
                <p className="articleCardDesc">{article.description}</p>
                <p className="articleCardAuthor">✍️ {article.author}</p>
              </Link>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}