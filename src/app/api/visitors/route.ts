import { NextRequest, NextResponse } from 'next/server'
import { getKVClient, incrementVisitors } from '@/lib/kv'

export async function GET(request: NextRequest) {
  try {
    const kv = getKVClient()
    
    if (!kv) {
      // 开发模式或未配置 KV，返回模拟数据
      console.log('KV not configured, using mock mode')
      return NextResponse.json({ 
        visitors: 1688,
        isMock: true
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
