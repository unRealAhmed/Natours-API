// Custom error class to handle operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    // Determine the status type ('fail' for client errors, 'error' for server errors)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Mark the error as operational (for distinction in error handling)
    this.isOperational = true;

    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
