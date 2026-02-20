import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generatePublicationId } from '../../helpers/uuid-generator.js';
import { User } from '../users/user.model.js';

export const Publication = sequelize.define(
  'Publication',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generatePublicationId(),
    },
    Title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'title',
      validate: {
        notEmpty: { msg: 'El título es obligatorio.' },
        len: {
          args: [3, 200],
          msg: 'El título debe tener entre 3 y 200 caracteres.',
        },
      },
    },
    Category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'category',
      validate: {
        notEmpty: { msg: 'La categoría es obligatoria.' },
        len: {
          args: [3, 50],
          msg: 'La categoría debe tener entre 3 y 50 caracteres.',
        },
        isIn: {
          args: [['Tecnología', 'Negocios', 'Educación', 'Salud', 'Lifestyle', 'Otro']],
          msg: 'Categoría no válida. Use: Tecnología, Negocios, Educación, Salud, Lifestyle, Otro',
        },
      },
    },
    Text: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'text',
      validate: {
        notEmpty: { msg: 'El contenido es obligatorio.' },
        len: {
          args: [10, 10000],
          msg: 'El contenido debe tener entre 10 y 10000 caracteres.',
        },
      },
    },
    AuthorId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'author_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    tableName: 'publications',
    timestamps: true,
    underscored: true,
  }
);

Publication.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'Author',
});

User.hasMany(Publication, {
  foreignKey: 'author_id',
  as: 'Publications',
});
