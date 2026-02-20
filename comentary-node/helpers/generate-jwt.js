import jwt from 'jsonwebtoken';

/**
 * Verifica y decodifica un JWT
 * @param {string} token - El token JWT a verificar
 * @returns {Promise<Object>} El payload decodificado
 */
export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
