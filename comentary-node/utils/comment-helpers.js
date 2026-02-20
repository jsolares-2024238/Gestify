/**
 * Construye la respuesta para un comentario
 * @param {Object} comment - El comentario de la base de datos
 * @returns {Object} El comentario formateado
 */
export const buildCommentResponse = (comment) => {
  if (!comment) return null;

  const response = {
    id: comment.Id,
    content: comment.Content,
    userId: comment.UserId,
    publicationId: comment.PublicationId,
    createdAt: comment.CreatedAt,
    updatedAt: comment.UpdatedAt,
  };

  // Agregar información del usuario si está disponible
  if (comment.User) {
    response.user = {
      id: comment.User.Id,
      username: comment.User.Username,
      name: comment.User.Name,
      surname: comment.User.Surname,
    };
  }

  // Agregar información de la publicación si está disponible
  if (comment.Publication) {
    response.publication = {
      id: comment.Publication.Id,
      title: comment.Publication.Title,
    };
  }

  return response;
};

/**
 * Valida el contenido de un comentario
 * @param {string} content - El contenido a validar
 * @returns {Object} { valid: boolean, message: string }
 */
export const validateCommentContent = (content) => {
  if (!content || typeof content !== 'string') {
    return {
      valid: false,
      message: 'El contenido es obligatorio',
    };
  }

  const trimmed = content.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: 'El contenido no puede estar vacío',
    };
  }

  if (trimmed.length > 2000) {
    return {
      valid: false,
      message: 'El contenido no puede exceder 2000 caracteres',
    };
  }

  return {
    valid: true,
    message: 'Contenido válido',
  };
};

/**
 * Sanitiza el contenido de un comentario
 * @param {string} content - El contenido a sanitizar
 * @returns {string} El contenido sanitizado
 */
export const sanitizeCommentContent = (content) => {
  if (!content || typeof content !== 'string') return '';

  // Eliminar espacios en blanco al inicio y al final
  let sanitized = content.trim();

  // Reemplazar múltiples espacios en blanco con uno solo
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized;
};
