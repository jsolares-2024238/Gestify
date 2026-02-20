import { verifyJWT } from '../helpers/generate-jwt.js';
import { User } from '../src/users/user.model.js';

/**
 * Middleware para validar JWT
 */
export const validateJWT = async (req, res, next) => {
  try {
    let token =
      req.header('x-token') ||
      req.header('authorization') ||
      req.body.token ||
      req.query.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No hay token en la petición',
      });
    }

    // Limpiar el token si viene con Bearer
    token = token.replace(/^Bearer\s+/, '');

    // Verificar el token
    const decoded = await verifyJWT(token);

    // Buscar el usuario por ID (decoded.sub es string)
    const user = await User.findOne({
      where: { id: decoded.sub },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token no válido - Usuario no existe',
      });
    }

    // Agregar el usuario al request
    req.user = user;
    req.userId = user.Id.toString();

    next();
  } catch (error) {
    console.error('Error validating JWT:', error);
    return res.status(401).json({
      success: false,
      message: 'Token no válido',
    });
  }
};
