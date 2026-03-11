import { kv } from '@vercel/kv'
import Redis from 'ioredis'

// 检查环境变量
const KV_URL = 
  process.env.KV_URL || 
  process.env.NEXT_PUBLIC_KV_URL ||
  process.env.UPSTASH_REDIS_REST_URL

const KV_TOKEN = 
  process.env.KV_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN

const REDIS_URL = process.env.REDIS_URL

// 初始化 Redis 客户端（支持多种方式）
export function getRedisClient() {
  if (REDIS_URL) {
    // Redis Labs 或其他 Redis 连接字符串
    try {
      return new Redis(REDIS_URL)
    } catch (error) {
      console.error('Failed to initialize Redis client:', error)
      return null
    }
  }
  
  if (KV_URL && KV_TOKEN) {
    // Vercel KV 或 Upstash Redis
    try {
      return kv
    } catch (error) {
      console.error('Failed to initialize KV client:', error)
      return null
    }
  }
  
  return null
}

// 获取点赞数
export async function getLikes(): Promise<number> {
  const client = getRedisClient()
  if (!client) {
    return 1688 // 默认值
  }
  
  try {
    const likesRaw = await client.get('likes')
    const likes = typeof likesRaw === 'string' || typeof likesRaw === 'number' 
      ? Number(likesRaw) 
      : null
    return likes ?? 1688
  } catch (error) {
    console.error('Failed to get likes:', error)
    return 1688
  }
}

// 增加点赞数
export async function incrementLikes(): Promise<number> {
  const client = getRedisClient()
  if (!client) {
    return 1689 // 默认值
  }
  
  try {
    await client.incr('likes')
    const likesRaw = await client.get('likes')
    const likes = typeof likesRaw === 'string' || typeof likesRaw === 'number' 
      ? Number(likesRaw) 
      : null
    return likes ?? 1689
  } catch (error) {
    console.error('Failed to increment likes:', error)
    return 1689
  }
}

// 获取访客数
export async function getVisitors(): Promise<number> {
  const client = getRedisClient()
  if (!client) {
    return 1688 // 默认值
  }
  
  try {
    const visitorsRaw = await client.get('visitors')
    const visitors = typeof visitorsRaw === 'string' || typeof visitorsRaw === 'number' 
      ? Number(visitorsRaw) 
      : null
    return visitors ?? 1688
  } catch (error) {
    console.error('Failed to get visitors:', error)
    return 1688
  }
}

// 增加访客数（基于 IP 防重复）
export async function incrementVisitors(ip: string): Promise<number> {
  const client = getRedisClient()
  if (!client) {
    return 1689 // 默认值
  }
  
  const visitedKey = `visited_${ip}`
  const hasVisitedRaw = await client.get(visitedKey)
  
  if (hasVisitedRaw) {
    // 已访问过，不增加
    try {
      const visitorsRaw = await client.get('visitors')
      const visitors = typeof visitorsRaw === 'string' || typeof visitorsRaw === 'number' 
        ? Number(visitorsRaw) 
        : null
      return visitors ?? 1688
    } catch {
      return 1688
    }
  }
  
  // 首次访问，增加访客数
  try {
    await client.incr('visitors')
    await client.set(visitedKey, '1', 'EX', 60 * 60 * 24 * 30) // 30天过期
    const visitorsRaw = await client.get('visitors')
    const visitors = typeof visitorsRaw === 'string' || typeof visitorsRaw === 'number' 
      ? Number(visitorsRaw) 
      : null
    return visitors ?? 1689
  } catch (error) {
    console.error('Failed to increment visitors:', error)
    return 1689
  }
}
