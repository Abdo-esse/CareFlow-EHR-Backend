import { createClient } from 'redis';

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });

    redisClient.on('error', (err) => console.error('Erreur Redis :', err));

    await redisClient.connect();

    console.log('Redis connecté avec succès');
  } catch (error) {
    console.error('Erreur de connexion Redis :', error.message);
  }
};

export { connectRedis, redisClient };
