import { kv } from '@vercel/kv'

// 读取 KV_URL 从环境变量
const KV_URL = process.env.KV_URL || process.env.NEXT_PUBLIC_KV_URL

// 初始化 KV 客户端
export function getKVClient() {
  if (!KV_URL) {
    console.warn('KV_URL is not set, using mock mode')
    return null
  }
  return kv
}

// 获取点赞数
export async function getLikes(): Promise<number> {
  const kv = getKVClient()
  if (!kv) {
    return 1688 // 默认值
  }
  
  try {
    const likes = await kv.get<number>('likes')
    return likes ?? 1688
  } catch (error) {
    console.error('Failed to get likes:', error)
    return 1688
  }
}

// 增加点赞数
export async function incrementLikes(): Promise<number> {
  const kv = getKVClient()
  if (!kv) {
    return 1689 // 默认值
  }
  
  try {
    const likes = await kv.incr('likes')
    return likes ?? 1689
  } catch (error) {
    console.error('Failed to increment likes:', error)
    return 1689
  }
}

// 获取访客数
export async function getVisitors(): Promise<number> {
  const kv = getKVClient()
  if (!kv) {
    return 1688 // 默认值
  }
  
  try {
    const visitors = await kv.get<number>('visitors')
    return visitors ?? 1688
  } catch (error) {
    console.error('Failed to get visitors:', error)
    return 1688
  }
}

// 增加访客数（基于 IP 防重复）
export async function incrementVisitors(ip: string): Promise<number> {
  const kv = getKVClient()
  if (!kv) {
    return 1689 // 默认值
  }
  
  const visitedKey = `visited_${ip}`
  const hasVisited = await kv.get(visitedKey)
  
  if (hasVisited) {
    // 已访问过，不增加
    try {
      const visitors = await kv.get<number>('visitors')
      return visitors ?? 1688
    } catch {
      return 1688
    }
  }
  
  // 首次访问，增加访客数
  try {
    await kv.incr('visitors')
    await kv.set(visitedKey, '1', { ex: 60 * 60 * 24 * 30 }) // 30天过期
    const visitors = await kv.get<number>('visitors')
    return visitors ?? 1689
  } catch (error) {
    console.error('Failed to increment visitors:', error)
    return 1689
  }
}
