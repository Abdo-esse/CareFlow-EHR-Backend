import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initMinio } from './config/minio.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import logger from './utils/logger.js';

const app = express();

// === CORS configuration ===
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['set-cookie'],
};

// === Global middlewares ===
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors(corsOptions));
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: {
      write: (msg) => logger.http(msg.trim()),
    },
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// === Health Check ===
app.options('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// === Main API routes ===
app.use('/api/v1', routes);

// === 404 Handler ===
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// === Global Error Middleware ===
app.use(errorHandler);

// === Start Server ===
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    logger.info('Initialisation du serveur CareFlow EHR...');

    await connectDB();
    logger.info('MongoDB connecté avec succès');

    await connectRedis();
    logger.info('Redis connecté avec succès');

    await initMinio();
    logger.info('MinIO initialisé avec succès');

    app.listen(PORT, () => {
      logger.info(`Serveur opérationnel sur le port ${PORT}`);
    });
  } catch (error) {
    logger.error('Erreur critique au démarrage du serveur :', error);
    process.exit(1);
  }
};

startServer();

export default app;
