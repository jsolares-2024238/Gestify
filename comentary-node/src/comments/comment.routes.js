import { Router } from 'express';
import {
  getCommentsByPublication,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUser,
} from './comment.controller.js';

const router = Router();

// GET /api/v1/comments/publication/:publicationId
router.get('/publication/:publicationId', ...getCommentsByPublication);

// GET /api/v1/comments/user/:userId
router.get('/user/:userId', ...getCommentsByUser);

// POST /api/v1/comments
router.post('/', ...createComment);

// PUT /api/v1/comments/:commentId
router.put('/:commentId', ...updateComment);

// DELETE /api/v1/comments/:commentId
router.delete('/:commentId', ...deleteComment);

export default router;
