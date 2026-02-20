import rateLimit from 'express-rate-limit';

// Rate limiter general para la API
export const requestLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
    retryAfter: 900, // 15 minutos en segundos
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
      retryAfter: 900,
    });
  },
});

// Rate limiter para creación de comentarios (más restrictivo)
export const commentCreateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 comentarios por minuto
  message: {
    success: false,
    message: 'Demasiados comentarios creados, espera un momento.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Demasiados comentarios creados, espera un momento.',
      retryAfter: 60,
    });
  },
});
