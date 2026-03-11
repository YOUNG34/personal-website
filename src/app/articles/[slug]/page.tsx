import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getArticles } from '@/lib/articles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const articles = getArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <>
      <Navigation />
      
      <main className="main">
        <article className="article">
          <header className="article-header">
            <p className="article-date">{article.date}</p>
            <h1 className="article-title">{article.title}</h1>
            {article.description && (
              <p className="article-desc">{article.description}</p>
            )}
          </header>
          
          <div className="article-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      <Footer />
      
      <style jsx>{`
        .main {
          min-height: 100vh;
          padding: 8rem 3rem 4rem;
          position: relative;
          z-index: 1;
        }
        
        .article {
          max-width: 720px;
          margin: 0 auto;
        }
        
        .article-header {
          margin-bottom: 3rem;
          text-align: center;
        }
        
        .article-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        
        .article-title {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .article-desc {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.7;
        }
        
        .article-content {
          color: var(--text-secondary);
          line-height: 1.8;
        }
        
        .article-content :global(h1),
        .article-content :global(h2),
        .article-content :global(h3) {
          color: var(--text-primary);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .article-content :global(h2) {
          font-size: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
        }
        
        .article-content :global(p) {
          margin-bottom: 1.5rem;
        }
        
        .article-content :global(a) {
          color: var(--accent-warm);
          text-decoration: underline;
        }
        
        .article-content :global(code) {
          background: var(--bg-card);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
        }
        
        .article-content :global(pre) {
          background: var(--bg-card);
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        
        .article-content :global(pre code) {
          background: transparent;
          padding: 0;
        }
        
        .article-content :global(ul),
        .article-content :global(ol) {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        
        .article-content :global(li) {
          margin-bottom: 0.5rem;
        }
        
        .article-content :global(blockquote) {
          border-left: 3px solid var(--accent-warm);
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--text-muted);
        }
        
        .article-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .article-content :global(hr) {
          border: none;
          border-top: 1px solid var(--border-subtle);
          margin: 3rem 0;
        }
        
        .article-content :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
        }
        
        .article-content :global(th),
        .article-content :global(td) {
          border: 1px solid var(--border-subtle);
          padding: 0.75rem 1rem;
          text-align: left;
        }
        
        .article-content :global(th) {
          background: var(--bg-card);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .main {
            padding: 6rem 1.5rem 3rem;
          }
        }
      `}</style>
    </>
  )
}