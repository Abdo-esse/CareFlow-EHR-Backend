import { createClient } from 'redis';
import logger from '../utils/logger.js';

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });

    redisClient.on('error', (err) => logger.error('Erreur Redis :', err));

    await redisClient.connect();

    logger.info('Redis connecté avec succès');
  } catch (error) {
    logger.error('Erreur de connexion Redis :', error.message);
  }
};

export { connectRedis, redisClient };
