export class AppError extends Error {
  readonly statusCode: number;
  readonly errors?: { field?: string; message: string }[];
  readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    errors?: { field?: string; message: string }[],
    isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
