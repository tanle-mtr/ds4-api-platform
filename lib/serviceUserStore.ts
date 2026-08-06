import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';
import { ServiceUser } from '@/types';
import { generateApiKey } from './apiKey';
import { QuotaManager } from './quota';

let redis: Redis | null = null;
let redisChecked = false;

function getRedis(): Redis | null {
  if (redisChecked) return redis;
  redisChecked = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

const USERS_KEY = 'service:users';

let memoryUsers: ServiceUser[] | null = null;

const PLAN_QUOTAS: Record<ServiceUser['plan'], number> = {
  free: 1000000,
  professional: 5000000,
  team: 10000000,
};

function serialize(user: ServiceUser): ServiceUser {
  return { ...user };
}

function nextResetDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

async function readAll(): Promise<ServiceUser[]> {
  const client = getRedis();
  if (client) {
    try {
      const raw = await client.get<ServiceUser[]>(USERS_KEY);
      return Array.isArray(raw) ? raw : [];
    } catch (err) {
      console.error('Failed to read service users from Redis:', err);
    }
  }
  return memoryUsers ? memoryUsers.map(serialize) : [];
}

async function writeAll(users: ServiceUser[]): Promise<void> {
  const client = getRedis();
  if (client) {
    try {
      await client.set(USERS_KEY, users);
      return;
    } catch (err) {
      console.error('Failed to write service users to Redis:', err);
    }
  }
  memoryUsers = users.map(serialize);
}

export interface CreateServiceUserInput {
  name: string;
  email?: string;
  plan: ServiceUser['plan'];
  quotaTotal?: number;
}

export class ServiceUserStore {
  static async list(): Promise<ServiceUser[]> {
    const users = await readAll();
    return Promise.all(
      users.map(async (u) => {
        const usage = await QuotaManager.getUsageStats(u.id);
        return {
          ...serialize(u),
          quota: { ...u.quota, used: usage.used },
        };
      })
    );
  }

  static async getById(id: string): Promise<ServiceUser | null> {
    const users = await readAll();
    const user = users.find((u) => u.id === id);
    return user ? serialize(user) : null;
  }

  static async getByApiKey(apiKey: string): Promise<ServiceUser | null> {
    const users = await readAll();
    const user = users.find((u) => u.apiKey === apiKey);
    return user ? serialize(user) : null;
  }

  static async create(input: CreateServiceUserInput): Promise<ServiceUser> {
    const now = new Date().toISOString();
    const total = input.quotaTotal && input.quotaTotal > 0 ? input.quotaTotal : PLAN_QUOTAS[input.plan];
    const user: ServiceUser = {
      id: `su_${nanoid(16)}`,
      name: input.name,
      email: input.email || '',
      plan: input.plan,
      quota: { total, used: 0, resetDate: nextResetDate() },
      apiKey: generateApiKey(),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    const users = await readAll();
    users.push(user);
    await writeAll(users);
    await QuotaManager.resetMonthlyQuota(user.id);
    await QuotaManager.setQuota(user.id, total);
    return serialize(user);
  }

  static async update(
    id: string,
    patch: Partial<Pick<ServiceUser, 'name' | 'email' | 'plan' | 'isActive'>> & {
      quotaTotal?: number;
      resetUsage?: boolean;
      regenerateKey?: boolean;
    }
  ): Promise<ServiceUser | null> {
    const users = await readAll();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const current = users[index];
    const updated: ServiceUser = {
      ...serialize(current),
      name: patch.name ?? current.name,
      email: patch.email ?? current.email,
      plan: patch.plan ?? current.plan,
      isActive: patch.isActive ?? current.isActive,
      updatedAt: new Date().toISOString(),
    };

    if (typeof patch.quotaTotal === 'number' && patch.quotaTotal > 0) {
      updated.quota = { ...updated.quota, total: patch.quotaTotal };
      await QuotaManager.setQuota(updated.id, patch.quotaTotal);
    } else if (patch.plan && patch.plan !== current.plan) {
      updated.quota = { ...updated.quota, total: PLAN_QUOTAS[patch.plan] };
      await QuotaManager.setQuota(updated.id, PLAN_QUOTAS[patch.plan]);
    }

    if (patch.resetUsage) {
      updated.quota = { ...updated.quota, used: 0 };
      await QuotaManager.setUsage(id, 0);
    }

    if (patch.regenerateKey) {
      updated.apiKey = generateApiKey();
    }

    users[index] = serialize(updated);
    await writeAll(users);
    return serialize(updated);
  }

  static async remove(id: string): Promise<boolean> {
    const users = await readAll();
    const next = users.filter((u) => u.id !== id);
    if (next.length === users.length) return false;
    await writeAll(next);
    return true;
  }

  static async authenticate(apiKey: string): Promise<ServiceUser | null> {
    const user = await this.getByApiKey(apiKey);
    if (!user || !user.isActive) return null;
    return user;
  }
}