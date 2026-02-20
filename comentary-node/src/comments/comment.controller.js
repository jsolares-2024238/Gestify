import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  createComment as dbCreateComment,
  findCommentById,
  updateComment as dbUpdateComment,
  deleteComment as dbDeleteComment,
  findCommentsByPublicationId,
} from '../../helpers/comment-db.js';
import { buildCommentResponse } from '../../utils/comment-helpers.js';

// GET /api/v1/comments/publication/:publicationId
export const getCommentsByPublication = [
  asyncHandler(async (req, res) => {
    const { publicationId } = req.params;

    if (!publicationId) {
      return res.status(400).json({
        success: false,
        message: 'Publication ID is required',
      });
    }

    const comments = await findCommentsByPublicationId(publicationId);
    const payload = comments.map(buildCommentResponse);

    return res.status(200).json({
      success: true,
      data: payload,
      count: payload.length,
    });
  }),
];

// POST /api/v1/comments
export const createComment = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { content, publicationId } = req.body;

    if (!content || !publicationId) {
      return res.status(400).json({
        success: false,
        message: 'Content and publicationId are required',
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Content cannot be empty',
      });
    }

    if (content.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Content cannot exceed 2000 characters',
      });
    }

    const comment = await dbCreateComment({
      content: content.trim(),
      userId,
      publicationId,
    });

    return res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: buildCommentResponse(comment),
    });
  }),
];

// PUT /api/v1/comments/:commentId
export const updateComment = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Content cannot be empty',
      });
    }

    if (content.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Content cannot exceed 2000 characters',
      });
    }

    const comment = await findCommentById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Verificar que el usuario es el propietario del comentario
    if (comment.UserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments',
      });
    }

    const updatedComment = await dbUpdateComment(commentId, {
      content: content.trim(),
    });

    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: buildCommentResponse(updatedComment),
    });
  }),
];

// DELETE /api/v1/comments/:commentId
export const deleteComment = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { commentId } = req.params;

    const comment = await findCommentById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Verificar que el usuario es el propietario del comentario
    if (comment.UserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments',
      });
    }

    await dbDeleteComment(commentId);

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  }),
];

// GET /api/v1/comments/user/:userId
export const getCommentsByUser = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const comments = await Comment.findAll({
      where: { user_id: userId },
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
      order: [['created_at', 'DESC']],
    });

    const payload = comments.map(buildCommentResponse);

    return res.status(200).json({
      success: true,
      data: payload,
      count: payload.length,
    });
  }),
];
