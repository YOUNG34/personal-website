import { NextRequest, NextResponse } from 'next/server'
import { getKVClient, incrementLikes } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const kv = getKVClient()
    
    if (!kv) {
      // 开发模式或未配置 KV，返回模拟数据
      console.log('KV not configured, using mock mode')
      return NextResponse.json({ 
        likes: 1688,
        message: 'Mock mode - KV not configured' 
      })
    }

    // 增加点赞数
    const likes = await incrementLikes()

    return NextResponse.json({ 
      likes,
      message: 'Liked successfully' 
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
    const kv = getKVClient()
    
    if (!kv) {
      return NextResponse.json({ likes: 1688 })
    }

    const likes = await kv.get<number>('likes') || 1688

    return NextResponse.json({ likes })
  } catch (error) {
    console.error('Failed to get likes:', error)
    return NextResponse.json({ likes: 1688 }, { status: 500 })
  }
}
