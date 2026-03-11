import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getArticles } from '@/lib/articles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import TableOfContents from '@/components/TableOfContents'
import '../../styles.css'

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
      
      <main className="articleMain">
        <div className="articleLayout">
          <div className="articleLeft">
            <TableOfContents content={article.content} />
          </div>
          <div className="articleRight">
            <article className="article">
              <header className="articleHeader">
                <p className="articleDate">{article.date}</p>
                <h1 className="articleTitle">{article.title}</h1>
                {article.description && (
                  <p className="articleDesc">{article.description}</p>
                )}
                <div className="articleMeta">
                  <span>✍️ {article.author}</span>
                  <span>📧 {article.email}</span>
                </div>
              </header>
              
              <div className="articleContent">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkSlug as any]}>
                  {article.content}
                </ReactMarkdown>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
