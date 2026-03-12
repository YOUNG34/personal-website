'use client'

import { usePathname } from 'next/navigation'
import LikeButton from './LikeButton'

interface LikeButtonWrapperProps {
  initialLikes: number
}

export default function LikeButtonWrapper({ initialLikes }: LikeButtonWrapperProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  if (!isHomePage) return null
  
  return <LikeButton initialLikes={initialLikes} />
}