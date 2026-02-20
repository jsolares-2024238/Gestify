'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
// Ensure models are registered before DB sync
import '../src/comments/comment.model.js';
import '../src/users/user.model.js';
import '../src/publications/publication.model.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors.configuration.js';
import { helmetConfiguration } from './helmet-configurations.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';
import commentRoutes from '../src/comments/comment.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  app.use(`${BASE_PATH}/comments`, commentRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'Gestify Commentary Service',
    });
  });
  // 404 handler (standardized)
  app.use(notFound);
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT;
  app.set('trust proxy', 1);

  middlewares(app);

  // Database connection
  await dbConnection();

  routes(app);

  // Global error handler (after routes)
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
  });
};
