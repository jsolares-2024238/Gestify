import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import '../src/users/user.model.js';
import '../src/publications/publication.model.js';
import { corsOptions } from './cors.configuration.js';
import { helmetConfiguration } from './helmet-configurations.js';
import { errorHandler, notFound } from '../middlewares/server-genericError-handler.js';
import publicationRoutes from '../src/publications/publication.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  app.use(`${BASE_PATH}/publications`, publicationRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'Gestify Public Service',
    });
  });

  app.use(notFound);
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  app.set('trust proxy', 1);

  middlewares(app);
  await dbConnection();
  routes(app);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Gestify Public Service running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
  });
};
