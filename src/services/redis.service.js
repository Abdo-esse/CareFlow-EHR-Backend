import { redisClient } from "../config/redis.js";

export const revokeToken = async (token, exp) => {
     const ttl = exp - Math.floor(Date.now() / 1000);
  await redisClient.set(`revoked:${token}`, "true", { EX: ttl });
}   

export const isTokenRevoked = async (token) => {
    const result = await redisClient.get(`revoked:${token}`);
    return result === "true";
}