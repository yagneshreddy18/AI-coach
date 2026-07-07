import { validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';

// Middleware that checks express-validator results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    throw new ApiError(400, messages.join('. '));
  }
  next();
};
