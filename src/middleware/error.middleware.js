const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = 500;
  const message = 'Internal Server Error';
  const errorDetail = process.env.NODE_ENV === 'development' ? err.message : undefined;

  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorDetail
  });
};

module.exports = errorHandler;