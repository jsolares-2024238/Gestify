'use strict';

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de PostgreSQL
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: process.env.DB_SQL_LOGGING === 'true' ? console.log : false,
  define: {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Función para conectar a la base de datos
export const dbConnection = async () => {
  try {
    console.log('PostgreSQL | Trying to connect...');

    await sequelize.authenticate();
    console.log('PostgreSQL | Connected to PostgreSQL');
    console.log('PostgreSQL | Connection to database established');

    // Sincronizar modelos en desarrollo
    if (process.env.NODE_ENV === 'development') {
      const syncLogging =
        process.env.DB_SQL_LOGGING === 'true' ? console.log : false;
      await sequelize.sync({ alter: true, logging: syncLogging });
      console.log('PostgreSQL | Models synchronized with database');
    }
  } catch (error) {
    console.error('PostgreSQL | Could not connect to PostgreSQL');
    console.error('PostgreSQL | Error:', error.message);
    throw error;
  }
};
