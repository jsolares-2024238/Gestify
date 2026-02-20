import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'gestify',
  process.env.DB_USERNAME || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    await sequelize.sync({ alter: false });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export { sequelize };
