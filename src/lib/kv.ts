import { createClient } from 'redis'

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

// 获取点赞数
export async function getLikes(): Promise<number> {
  const client = await getRedisClient()
  if (!client) {
    return 1688 // 默认值
  }
  
  try {
    const likesRaw = await client.get('likes')
    const likes = likesRaw !== null ? Number(likesRaw) : null
    return likes ?? 1688
  } catch (error) {
    console.error('Failed to get likes:', error)
    return 1688
  }
}

// 增加点赞数
export async function incrementLikes(): Promise<number> {
  const client = await getRedisClient()
  if (!client) {
    return 1689 // 默认值
  }
  
  try {
    await client.incr('likes')
    const likesRaw = await client.get('likes')
    const likes = likesRaw !== null ? Number(likesRaw) : null
    return likes ?? 1689
  } catch (error) {
    console.error('Failed to increment likes:', error)
    return 1689
  }
}

// 获取访客数
export async function getVisitors(): Promise<number> {
  const client = await getRedisClient()
  if (!client) {
    return 1688 // 默认值
  }
  
  try {
    const visitorsRaw = await client.get('visitors')
    const visitors = visitorsRaw !== null ? Number(visitorsRaw) : null
    return visitors ?? 1688
  } catch (error) {
    console.error('Failed to get visitors:', error)
    return 1688
  }
}

// 增加访客数（基于 IP 防重复）
export async function incrementVisitors(ip: string): Promise<number> {
  const client = await getRedisClient()
  if (!client) {
    return 1689 // 默认值
  }
  
  const visitedKey = `visited_${ip}`
  const hasVisitedRaw = await client.get(visitedKey)
  
  if (hasVisitedRaw) {
    // 已访问过，不增加
    try {
      const visitorsRaw = await client.get('visitors')
      const visitors = visitorsRaw !== null ? Number(visitorsRaw) : null
      return visitors ?? 1688
    } catch {
      return 1688
    }
  }
  
  // 首次访问，增加访客数
  try {
    await client.incr('visitors')
    await client.set(visitedKey, '1', { EX: 60 * 60 * 24 * 30 }) // 30天过期
    const visitorsRaw = await client.get('visitors')
    const visitors = visitorsRaw !== null ? Number(visitorsRaw) : null
    return visitors ?? 1689
  } catch (error) {
    console.error('Failed to increment visitors:', error)
    return 1689
  }
}
