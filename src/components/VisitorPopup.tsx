'use client'

import { useState, useEffect } from 'react'

interface VisitorPopupProps {
  initialVisitors: number
}

export default function VisitorPopup({ initialVisitors }: VisitorPopupProps) {
  const [visitors, setVisitors] = useState(initialVisitors)
  const [showPopup, setShowPopup] = useState(false)
  const [hasVisited, setHasVisited] = useState(false)

  // 检查是否已显示过弹窗
  useEffect(() => {
    const hasVisited = localStorage.getItem('visited_owen_website')
    if (!hasVisited) {
      setHasVisited(false)
      setShowPopup(true)
    } else {
      setHasVisited(true)
    }
  }, [])

  // 获取访客数
  useEffect(() => {
    if (hasVisited) return

    const fetchVisitors = async () => {
      try {
        const response = await fetch('/api/visitors')
        const data = await response.json()
        setVisitors(data.visitors)
      } catch (error) {
        console.error('Failed to fetch visitors:', error)
        setVisitors(initialVisitors)
      }
    }

    fetchVisitors()
  }, [hasVisited, initialVisitors])

  // 记录已访问
  const handleClose = () => {
    localStorage.setItem('visited_owen_website', 'true')
    setShowPopup(false)
  }

  if (!showPopup) return null

  return (
    <div className="visitor-popup-overlay">
      <div className="visitor-popup">
        <div className="visitor-popup-content">
          <span className="visitor-icon">👋</span>
          <p className="visitor-text">
            您是本网站的第 <strong>{visitors.toLocaleString()}</strong> 位访客
          </p>
          <p className="visitor-subtext">欢迎来到 Owen's Notebook！</p>
        </div>
        <button 
          onClick={handleClose}
          className="visitor-close-btn"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
