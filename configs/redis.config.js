import { createClient } from "redis";

export const client = createClient({ url: process.env.REDIS_URL });
export async function redisConnect() {
  client.on("error", (err) => console.log("Redis Client Error", err));
  client.on("ready", () => console.log("Redis connected successfully"));

  await client.connect();
}

export const oneDayInSecs = 24 * 60 * 60;
