import { Router } from 'express';
import {
  createNewPublication,
  getAllPublicationsController,
  getPublicationByIdController,
  editPublication,
  deletePublicationController,
  getPublicationsByAuthorController,
} from './publication.controller.js';

const router = Router();

router.post('/', ...createNewPublication);

router.get('/', getAllPublicationsController);

router.get('/:publicationId', getPublicationByIdController);

router.get('/author/:authorId', getPublicationsByAuthorController);

router.put('/:publicationId', ...editPublication);

router.delete('/:publicationId', deletePublicationController);

export default router;
