import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';

// Modelo User - solo para referencia (debe existir en auth-node)
export const User = sequelize.define(
  'User',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
    },
    Name: {
      type: DataTypes.STRING(25),
      field: 'name',
    },
    Surname: {
      type: DataTypes.STRING(25),
      field: 'surname',
    },
    Username: {
      type: DataTypes.STRING(50),
      field: 'username',
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);
