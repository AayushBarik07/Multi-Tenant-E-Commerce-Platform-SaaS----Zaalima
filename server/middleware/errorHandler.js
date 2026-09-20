const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Specific Error Handling
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error: Check your input data';
  } else if (err.code === '23505') { 
    // PostgreSQL unique constraint violation
    statusCode = 409;
    message = 'Conflict: This record already exists.';
  } else if (err.message.includes('Unauthenticated')) {
    statusCode = 401;
    message = 'Unauthorized: Please log in.';
  }

  // Log the full error strictly in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${req.method} ${req.originalUrl} >> ${err.message}`);
    console.error(err.stack);
  } else {
    // Keep production logs clean
    console.error(`[Error] ${req.method} ${req.originalUrl} >> ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
