import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initMinio } from './config/minio.js';

import routes from './routes/index.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// === Middlewares globaux ===
app.use(helmet()); // sécurité headers HTTP
app.use(cors()); // Cross-Origin Resource Sharing
app.use(morgan('dev')); // logs des requêtes HTTP
app.use(express.json()); // body parser JSON
app.use(express.urlencoded({ extended: true })); // body parser URL-encoded
app.use(cookieParser()); // gestion cookies

// === Routes API versionnée ===
app.use('/api/v1', routes);

// === Middleware de gestion des erreurs ===
app.use(errorMiddleware);

// === Démarrage serveur après initialisation services ===
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connexion à la base de données MongoDB
    await connectDB();

    // Connexion à Redis
    await connectRedis();

    // Initialisation MinIO (bucket)
    await initMinio();

    // Démarrage du serveur Express
    app.listen(PORT, () => {
      console.log(`🚀 Serveur CareFlow EHR en ligne sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur serveur :', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
