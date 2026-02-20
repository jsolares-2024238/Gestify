export const validateJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    req.userId = req.headers['x-user-id'];
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};
