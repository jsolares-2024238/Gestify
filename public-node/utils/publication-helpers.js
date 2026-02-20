export const buildPublicationResponse = (publication) => {
  if (!publication) return null;

  return {
    id: publication.Id,
    title: publication.Title,
    category: publication.Category,
    text: publication.Text,
    author: publication.Author
      ? {
          id: publication.Author.id,
          name: publication.Author.Name,
          surname: publication.Author.Surname,
          username: publication.Author.Username,
        }
      : {
          id: publication.AuthorId,
        },
    createdAt: publication.CreatedAt,
    updatedAt: publication.UpdatedAt,
  };
};

export const validatePublicationInput = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Título es obligatorio y debe ser texto.');
  } else if (data.title.trim().length < 3) {
    errors.push('Título debe tener al menos 3 caracteres.');
  } else if (data.title.length > 200) {
    errors.push('Título no puede exceder 200 caracteres.');
  }

  const validCategories = ['Tecnología', 'Negocios', 'Educación', 'Salud', 'Lifestyle', 'Otro'];
  if (!data.category || typeof data.category !== 'string') {
    errors.push('Categoría es obligatoria y debe ser texto.');
  } else if (!validCategories.includes(data.category)) {
    errors.push(`Categoría debe ser una de: ${validCategories.join(', ')}`);
  }

  if (!data.text || typeof data.text !== 'string') {
    errors.push('Contenido es obligatorio y debe ser texto.');
  } else if (data.text.trim().length < 10) {
    errors.push('Contenido debe tener al menos 10 caracteres.');
  } else if (data.text.length > 10000) {
    errors.push('Contenido no puede exceder 10000 caracteres.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
