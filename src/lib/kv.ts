import { createClient } from 'redis'

// 基础数值（展示时会加上这个数）
const BASE_LIKES = 1688
const BASE_VISITORS = 1688

// 检查环境变量
const KV_URL = 
  process.env.KV_URL || 
  process.env.NEXT_PUBLIC_KV_URL ||
  process.env.UPSTASH_REDIS_REST_URL

const KV_TOKEN = 
  process.env.KV_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN

const REDIS_URL = process.env.REDIS_URL

// 初始化 Redis 客户端
let redisClient: ReturnType<typeof createClient> | null = null
let isClientInitialized = false

export async function getRedisClient() {
  if (redisClient && isClientInitialized) {
    return redisClient
  }

  // 尝试不同的连接方式
  let client: ReturnType<typeof createClient>
  
  if (REDIS_URL) {
    // Redis Labs 或其他 Redis 连接字符串
    client = createClient({ url: REDIS_URL })
  } else if (KV_URL && KV_TOKEN) {
    // Vercel KV 或 Upstash Redis
    const url = KV_URL.replace(/^https?:\/\//, 'redis://')
    client = createClient({ url, password: KV_TOKEN })
  } else {
    console.warn('No Redis configuration found, using mock mode')
    return null
  }

  // 错误处理
  client.on('error', (err) => {
    console.error('Redis Client Error:', err)
  })

  try {
    await client.connect()
    redisClient = client
    isClientInitialized = true
    console.log('Redis client initialized successfully')
    return client
  } catch (error) {
    console.error('Failed to initialize Redis client:', error)
    return null
  }
}

// 获取点赞数（返回 Redis 值 + 基础值）
export async function getLikes(): Promise<number> {
  const client = await getRedisClient()
  if (!client) {
    return BASE_LIKES
  }
  
  try {
    const likesRaw = await client.get('likes')
    const likes = likesRaw !== null ? Number(likesRaw) : 0
    return BASE_LIKES + likes
  } catch (error) {
    console.error('Failed to get likes:', error)
    return BASE_LIKES
  }
}

// 增加点赞数（返回 Redis 值 + 基础值）
export async function incrementLikes(): Promise<number> {
  const client = await getRedisClient()
  if (!client) {
    return BASE_LIKES + 1
  }
  
  try {
    await client.incr('likes')
    const likesRaw = await client.get('likes')
    const likes = likesRaw !== null ? Number(likesRaw) : 0
    return BASE_LIKES + likes
  } catch (error) {
    console.error('Failed to increment likes:', error)
    return BASE_LIKES + 1
  }
}

// 获取访客数（返回 Redis 值 + 基础值）
export async function getVisitors(): Promise<number> {
  const client = await getRedisClient()
  if (!client) {
    return BASE_VISITORS
  }
  
  try {
    const visitorsRaw = await client.get('visitors')
    const visitors = visitorsRaw !== null ? Number(visitorsRaw) : 0
    return BASE_VISITORS + visitors
  } catch (error) {
    console.error('Failed to get visitors:', error)
    return BASE_VISITORS
  }
}

// 增加访客数（返回 Redis 值 + 基础值）
export async function incrementVisitors(ip: string): Promise<number> {
  const client = await getRedisClient()
  if (!client) {
    return BASE_VISITORS + 1
  }
  
  const visitedKey = `visited_${ip}`
  const hasVisitedRaw = await client.get(visitedKey)
  
  if (hasVisitedRaw) {
    // 已访问过，不增加
    try {
      const visitorsRaw = await client.get('visitors')
      const visitors = visitorsRaw !== null ? Number(visitorsRaw) : 0
      return BASE_VISITORS + visitors
    } catch {
      return BASE_VISITORS
    }
  }
  
  // 首次访问，增加访客数
  try {
    await client.incr('visitors')
    await client.set(visitedKey, '1', { EX: 60 * 60 * 24 * 30 }) // 30天过期
    const visitorsRaw = await client.get('visitors')
    const visitors = visitorsRaw !== null ? Number(visitorsRaw) : 0
    return BASE_VISITORS + visitors
  } catch (error) {
    console.error('Failed to increment visitors:', error)
    return BASE_VISITORS + 1
  }
}
