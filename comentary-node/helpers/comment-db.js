import { Comment } from '../src/comments/comment.model.js';
import { User } from '../src/users/user.model.js';
import { Publication } from '../src/publications/publication.model.js';

// Crear un comentario
export const createComment = async ({ content, userId, publicationId }) => {
  try {
    const comment = await Comment.create({
      Content: content,
      UserId: userId,
      PublicationId: publicationId,
    });

    return await findCommentById(comment.Id);
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Buscar comentario por ID
export const findCommentById = async (commentId) => {
  try {
    const comment = await Comment.findOne({
      where: { id: commentId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['Id', 'Username', 'Name', 'Surname'],
        },
        {
          model: Publication,
          as: 'Publication',
          attributes: ['Id', 'Title'],
        },
      ],
    });

    return comment;
  } catch (error) {
    console.error('Error finding comment:', error);
    throw error;
  }
};

// Actualizar comentario
export const updateComment = async (commentId, { content }) => {
  try {
    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.Content = content;
    await comment.save();

    return await findCommentById(commentId);
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

// Eliminar comentario
export const deleteComment = async (commentId) => {
  try {
    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    await comment.destroy();
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Buscar comentarios por publicación
export const findCommentsByPublicationId = async (publicationId) => {
  try {
    const comments = await Comment.findAll({
      where: { publication_id: publicationId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['Id', 'Username', 'Name', 'Surname'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return comments;
  } catch (error) {
    console.error('Error finding comments by publication:', error);
    throw error;
  }
};

// Buscar comentarios por usuario
export const findCommentsByUserId = async (userId) => {
  try {
    const comments = await Comment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Publication,
          as: 'Publication',
          attributes: ['Id', 'Title'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return comments;
  } catch (error) {
    console.error('Error finding comments by user:', error);
    throw error;
  }
};

// Contar comentarios por publicación
export const countCommentsByPublication = async (publicationId) => {
  try {
    const count = await Comment.count({
      where: { publication_id: publicationId },
    });

    return count;
  } catch (error) {
    console.error('Error counting comments:', error);
    throw error;
  }
};
