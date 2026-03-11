'use client'

import { useState, useEffect } from 'react'

interface LikeButtonProps {
  initialLikes: number
}

export default function LikeButton({ initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // 从 localStorage 检查是否已点赞，并获取最新点赞数
  useEffect(() => {
    const liked = localStorage.getItem('liked_owen_website')
    if (liked) {
      setHasLiked(true)
    }
    
    // 获取最新点赞数
    fetch('/api/likes')
      .then(res => res.json())
      .then(data => setLikes(data.likes))
      .catch(() => {})
  }, [])

  const handleLike = async () => {
    if (hasLiked) return

    setIsAnimating(true)
    
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
      })
      
      const data = await response.json()
      setLikes(data.likes)
      setHasLiked(true)
      localStorage.setItem('liked_owen_website', 'true')
    } catch (error) {
      console.error('Failed to like:', error)
      // 网络失败时本地增加（仅视觉效果）
      setLikes((prev) => prev + 1)
      setHasLiked(true)
      localStorage.setItem('liked_owen_website', 'true')
    } finally {
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  return (
    <button
      onClick={handleLike}
      className={`like-button ${hasLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
      aria-label="点赞"
    >
      <span className="like-icon">
        {hasLiked ? '❤️' : '🤍'}
      </span>
      <span className="like-count">{likes}</span>
      <span className="like-text">{hasLiked ? '谢谢点赞' : '点个赞再走吧'}</span>
    </button>
  )
}
