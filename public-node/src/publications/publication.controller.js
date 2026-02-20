import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  createPublication,
  getAllPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
  getPublicationsByAuthor,
} from '../../helpers/publication-db.js';
import { buildPublicationResponse } from '../../utils/publication-helpers.js';

export const createNewPublication = [
  validateJWT,
  asyncHandler(async (req, res) => {
    console.log('Body recibido:', req.body);
    console.log('User ID:', req.userId);
    
    const { title, category, text } = req.body;
    const authorId = req.userId;

    if (!title || !category || !text) {
      return res.status(400).json({
        success: false,
        message: 'Título, categoría y contenido son obligatorios.',
        debug: { title, category, text, authorId, body: req.body }
      });
    }

    const publicationData = {
      Title: title,
      Category: category,
      Text: text,
      AuthorId: authorId,
    };

    const publication = await createPublication(publicationData);

    return res.status(201).json({
      success: true,
      message: 'Publicación creada exitosamente.',
      data: buildPublicationResponse(publication),
    });
  }),
];

export const getAllPublicationsController = asyncHandler(async (req, res) => {
  const publications = await getAllPublications();

  return res.status(200).json({
    success: true,
    data: publications.map((pub) => buildPublicationResponse(pub)),
  });
});

export const getPublicationByIdController = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;

  if (!publicationId) {
    return res.status(400).json({
      success: false,
      message: 'ID de publicación es obligatorio.',
    });
  }

  const publication = await getPublicationById(publicationId);

  if (!publication) {
    return res.status(404).json({
      success: false,
      message: 'Publicación no encontrada.',
    });
  }

  return res.status(200).json({
    success: true,
    data: buildPublicationResponse(publication),
  });
});

export const editPublication = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { publicationId } = req.params;
    const { title, category, text } = req.body;
    const currentUserId = req.userId;

    if (!publicationId) {
      return res.status(400).json({
        success: false,
        message: 'ID de publicación es obligatorio.',
      });
    }

    const publication = await getPublicationById(publicationId);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada.',
      });
    }

    if (publication.AuthorId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Solo el autor puede editar esta publicación.',
      });
    }

    if (!title && !category && !text) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar.',
      });
    }

    const updateData = {};
    if (title) updateData.Title = title;
    if (category) updateData.Category = category;
    if (text) updateData.Text = text;

    const updated = await updatePublication(publicationId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Publicación actualizada exitosamente.',
      data: buildPublicationResponse(updated),
    });
  }),
];

export const deletePublicationController = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { publicationId } = req.params;
    const currentUserId = req.userId;

    if (!publicationId) {
      return res.status(400).json({
        success: false,
        message: 'ID de publicación es obligatorio.',
      });
    }

    const publication = await getPublicationById(publicationId);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada.',
      });
    }

    if (publication.AuthorId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Solo el autor puede eliminar esta publicación.',
      });
    }

    const deleted = await deletePublication(publicationId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar la publicación.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Publicación eliminada exitosamente.',
    });
  }),
];

export const getPublicationsByAuthorController = asyncHandler(
  async (req, res) => {
    const { authorId } = req.params;

    if (!authorId) {
      return res.status(400).json({
        success: false,
        message: 'ID del autor es obligatorio.',
      });
    }

    const publications = await getPublicationsByAuthor(authorId);

    return res.status(200).json({
      success: true,
      data: publications.map((pub) => buildPublicationResponse(pub)),
    });
  }
);
