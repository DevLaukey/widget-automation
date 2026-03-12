import { Redis } from "@upstash/redis";

const redis = new Redis({
  url:   process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function dbGet<T>(key: string): Promise<T | null> {
  return redis.get<T>(key);
}

export async function dbSet(key: string, value: unknown): Promise<void> {
  await redis.set(key, value);
}

export async function dbUpdatedAt(key: string): Promise<string | null> {
  const ts = await redis.get<string>(`${key}:updated_at`);
  return ts ?? null;
}

export async function dbSetWithTimestamp(key: string, value: unknown): Promise<void> {
  const now = new Date().toISOString();
  await Promise.all([
    redis.set(key, value),
    redis.set(`${key}:updated_at`, now),
  ]);
}
