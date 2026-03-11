import { NextRequest, NextResponse } from 'next/server'
import { getRedisClient, incrementLikes } from '@/lib/kv'

// 模拟点赞计数（用于 Mock 模式）
let mockLikes = 1688

// API 路由配置：使用 Node.js 运行时
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const client = await getRedisClient()
    
    if (!client) {
      // Mock 模式：每次点赞增加计数
      mockLikes++
      return NextResponse.json({ 
        likes: mockLikes,
        message: 'Liked successfully (mock mode)',
        isMock: true
      })
    }

    // 增加点赞数
    const likes = await incrementLikes()

    return NextResponse.json({ 
      likes,
      message: 'Liked successfully',
      isMock: false
    })
  } catch (error) {
    console.error('Failed to increment likes:', error)
    return NextResponse.json({ 
      error: 'Failed to increment likes',
      likes: 1688
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await getRedisClient()
    
    if (!client) {
      return NextResponse.json({ likes: mockLikes, isMock: true })
    }

    const likesRaw = await client.get('likes')
    const likes = likesRaw !== null ? Number(likesRaw) : 1688

    return NextResponse.json({ likes, isMock: false })
  } catch (error) {
    console.error('Failed to get likes:', error)
    return NextResponse.json({ likes: 1688, isMock: true }, { status: 500 })
  }
}
