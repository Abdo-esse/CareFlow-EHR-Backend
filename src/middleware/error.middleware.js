import { AppError } from '../core/AppError.js';
import logger from '../utils/logger.js';

export default function errorMiddleware(err, req, res, next) {
  // Erreurs personnalisées
  if (err instanceof AppError) {
    logger.error(`[${err.statusCode}] - ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      validationErrors: err.validationErrors || null,
    });
  }

  // Erreurs Mongoose
  if (err.name === 'ValidationError') {
    logger.error(`[400] - Validation Error: ${err.message}`);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.message,
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    logger.error(`[400] - Duplicate field: ${field}`);
    return res.status(400).json({
      success: false,
      error: `Duplicate field: ${field}. Please use another value.`,
    });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    logger.error('[401] - Invalid token');
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    logger.error('[401] - Token expired');
    return res.status(401).json({
      success: false,
      error: 'Token expired',
    });
  }

  // Erreur par défaut
  logger.error(`[${err.status || 500}] - ${err.message}`);
  logger.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}
