import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generateCommentId } from '../../helpers/uuid-generator.js';
import { User } from '../users/user.model.js';
import { Publication } from '../publications/publication.model.js';

// Modelo Comment principal
export const Comment = sequelize.define(
  'Comment',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generateCommentId(),
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content',
      validate: {
        notEmpty: { msg: 'El contenido del comentario es obligatorio.' },
        len: {
          args: [1, 2000],
          msg: 'El contenido debe tener entre 1 y 2000 caracteres.',
        },
      },
    },
    UserId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    PublicationId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'publication_id',
      references: {
        model: 'publications',
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
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_comments_publication_id',
        fields: ['publication_id'],
      },
      {
        name: 'idx_comments_user_id',
        fields: ['user_id'],
      },
    ],
  }
);

// Asociaciones
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'User',
});

Comment.belongsTo(Publication, {
  foreignKey: 'publication_id',
  as: 'Publication',
});
