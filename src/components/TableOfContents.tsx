'use client'

import { useEffect, useState, useRef } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

// 提取 Markdown 中的标题
function extractHeadings(content: string): TOCItem[] {
  const headings: TOCItem[] = []
  const lines = content.split('\n')

  for (const line of lines) {
    // 匹配 h2 和 h3 标题
    const h2Match = line.match(/^##\s+(.+)$/)
    const h3Match = line.match(/^###\s+(.+)$/)
    const h4Match = line.match(/^####\s+(.+)$/)

    if (h2Match) {
      headings.push({
        id: h2Match[1].toLowerCase().replace(/\s+/g, '-'),
        text: h2Match[1],
        level: 2,
      })
    } else if (h3Match) {
      headings.push({
        id: h3Match[1].toLowerCase().replace(/\s+/g, '-'),
        text: h3Match[1],
        level: 3,
      })
    } else if (h4Match) {
      headings.push({
        id: h4Match[1].toLowerCase().replace(/\s+/g, '-'),
        text: h4Match[1],
        level: 4,
      })
    }
  }

  return headings
}

// 获取所有标题元素
function getHeadings(): Map<string, HTMLHeadingElement> {
  const map = new Map<string, HTMLHeadingElement>()
  const headings = document.querySelectorAll(
    '.articleContent h2[id], .articleContent h3[id], .articleContent h4[id]'
  )
  headings.forEach((el) => {
    if (el.id) {
      map.set(el.id, el as HTMLHeadingElement)
    }
  })
  return map
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    setHeadings(extractHeadings(content))
  }, [content])

  useEffect(() => {
    function handleScroll() {
      const headingsMap = getHeadings()
      const scrollPosition = window.scrollY + 150

      let currentId = ''
      const allHeadings = Array.from(headingsMap.entries())

      for (const [id, element] of allHeadings) {
        const top = element.offsetTop
        if (scrollPosition >= top) {
          currentId = id
        }
      }

      // 也检查最后一个标题
      if (allHeadings.length > 0) {
        const [lastId, lastElement] = allHeadings[allHeadings.length - 1]
        if (scrollPosition >= lastElement.offsetTop) {
          currentId = lastId
        }
      }

      setActiveId(currentId)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="toc-container">
      <div className="toc-inner">
        <h3 className="toc-title"> CONTENTS </h3>
        <nav className="toc-nav">
          <ul className="toc-list">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={`toc-item level-${heading.level} ${
                  activeId === heading.id ? 'active' : ''
                }`}
              >
                <a
                  href={`#${heading.id}`}
                  className="toc-link"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(heading.id)
                    if (element) {
                      const offset = element.offsetTop - 100
                      window.scrollTo({
                        top: offset,
                        behavior: 'smooth',
                      })
                    }
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
