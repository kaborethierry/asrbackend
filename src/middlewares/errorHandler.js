// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.status || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;