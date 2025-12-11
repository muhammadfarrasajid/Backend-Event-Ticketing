const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Conflict: Data already exists';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.isJoi) {
    statusCode = 400;
    message = err.details[0].message;
  }

  const errorDetail = process.env.NODE_ENV === 'development' ? err.message : undefined;

  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorDetail
  });
};

module.exports = errorHandler;