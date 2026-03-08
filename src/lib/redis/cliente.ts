// lib/redis.ts

/// configuracion local
// import { createClient, RedisClientType } from 'redis';

// // Evitamos crear múltiples clientes en desarrollo (Hot Reload)
// const globalForRedis = global as unknown as { redis: RedisClientType };

// export const redis = globalForRedis.redis || createClient({
//   url: process.env.REDIS_URL // Ejemplo: redis://localhost:6379 o la URL de Upstash
  
// });

// if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// // Función para conectar (importante en Serverless)
// export const connectRedis = async () => {
//   if (!redis.isOpen) {
//     await redis.connect();
//   }
// };

import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Nota: Con Upstash ya no necesitas la función "connectRedis" 
// porque funciona por peticiones HTTP automáticas.
export const connectRedis = async () => {
  // Puedes dejarla vacía para no romper el código existente
  return; 
};