import { NextRequest, NextResponse } from 'next/server'
import { getRedisClient, incrementVisitors } from '@/lib/kv'

// 模拟访客计数（用于 Mock 模式）
let mockVisitors = 1688

export async function GET(request: NextRequest) {
  try {
    const client = getRedisClient()
    
    if (!client) {
      // Mock 模式：每次请求都增加访客数
      mockVisitors++
      const ip = 'mock_ip'
      return NextResponse.json({ 
        visitors: mockVisitors,
        isMock: true,
        ip
      })
    }

    // 获取客户端 IP
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    
    // 增加访客数
    const visitors = await incrementVisitors(ip)

    return NextResponse.json({ 
      visitors,
      isMock: false,
      ip: ip === 'unknown' ? 'unknown' : '***' + ip.slice(-3)
    })
  } catch (error) {
    console.error('Failed to get visitors:', error)
    return NextResponse.json({ 
      visitors: 1688,
      error: 'Failed to get visitors' 
    }, { status: 500 })
  }
}
