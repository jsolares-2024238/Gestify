export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validación fallida',
      errors: err.errors.map((e) => e.message),
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error del servidor',
  });
};
