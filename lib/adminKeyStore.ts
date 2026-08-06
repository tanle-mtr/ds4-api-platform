import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
let redisChecked = false;

const KEY_STORE_KEY = 'admin:key';

let memoryKey: string | null = null;

function getRedis(): Redis | null {
  if (redisChecked) return redis;
  redisChecked = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

export interface AdminKeyState {
  initialized: boolean;
  source: 'redis' | 'env' | 'memory' | null;
}

export async function getAdminKey(): Promise<string | null> {
  const client = getRedis();
  if (client) {
    try {
      const stored = await client.get<string>(KEY_STORE_KEY);
      if (stored) return stored;
    } catch (err) {
      console.error('Failed to load admin key from Redis:', err);
    }
  }
  if (memoryKey) return memoryKey;
  const envKey = process.env.ADMIN_API_KEY;
  return envKey || null;
}

export async function getAdminKeyState(): Promise<AdminKeyState> {
  const client = getRedis();
  if (client) {
    try {
      const stored = await client.get<string>(KEY_STORE_KEY);
      if (stored) return { initialized: true, source: 'redis' };
    } catch (err) {
      console.error('Failed to load admin key from Redis:', err);
    }
  }
  if (memoryKey) return { initialized: true, source: 'memory' };
  if (process.env.ADMIN_API_KEY) return { initialized: true, source: 'env' };
  return { initialized: false, source: null };
}

export async function setAdminKey(key: string): Promise<void> {
  const client = getRedis();
  if (client) {
    try {
      await client.set(KEY_STORE_KEY, key);
      return;
    } catch (err) {
      console.error('Failed to save admin key to Redis:', err);
    }
  }
  memoryKey = key;
}

export async function isAdmin(request: NextRequest): Promise<boolean> {
  const expected = await getAdminKey();
  if (!expected) return false;
  const provided = request.headers.get('x-admin-key');
  return provided === expected;
}

export function isValidAdminKeyFormat(key: string): boolean {
  return typeof key === 'string' && key.trim().length >= 8;
}
