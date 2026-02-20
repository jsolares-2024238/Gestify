import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';

// Modelo Publication - solo para referencia (debe existir en public-node)
export const Publication = sequelize.define(
  'Publication',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
    },
    Title: {
      type: DataTypes.STRING(100),
      field: 'title',
    },
    UserId: {
      type: DataTypes.STRING(16),
      field: 'user_id',
    },
  },
  {
    tableName: 'publications',
    timestamps: false,
  }
);
