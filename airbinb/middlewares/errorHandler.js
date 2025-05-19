export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
      });
    }

    // Producción
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Error inesperado del sistema
    console.error('💥 Error inesperado:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ocurrió un error inesperado. Intente más tarde.',
    });
  };
