import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'articles')

export interface Article {
  slug: string
  title: string
  date: string
  description: string
  author: string
  email: string
  content: string
}

export function getArticles(): Omit<Article, 'content'>[] {
  // Create articles directory if it doesn't exist
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  const mdFiles = fileNames.filter(name => name.endsWith('.md'))

  const articles = mdFiles.map(fileName => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(articlesDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const date = data.date instanceof Date 
      ? data.date.toISOString().split('T')[0] 
      : data.date || new Date().toISOString().split('T')[0]

    return {
      slug,
      title: data.title || 'Untitled',
      date,
      description: data.description || content.slice(0, 150) + '...',
      author: data.author || 'Owen',
      email: data.email || 'zeyangyz@icloud.com',
    }
  })

  // Sort by date descending
  return articles.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const date = data.date instanceof Date 
      ? data.date.toISOString().split('T')[0] 
      : data.date || new Date().toISOString().split('T')[0]

    return {
      slug,
      title: data.title || 'Untitled',
      date,
      description: data.description || '',
      author: data.author || 'Owen',
      email: data.email || 'zeyangyz@icloud.com',
      content,
    }
  } catch {
    return null
  }
}