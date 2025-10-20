export class AppError extends Error {
  constructor(statusCode, message, isOperational = true, validationErrors = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.validationErrors = validationErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', validationErrors = null) {
    super(400, message, true, validationErrors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}
