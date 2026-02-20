import { Publication } from '../src/publications/publication.model.js';
import { User } from '../src/users/user.model.js';

export const createPublication = async (publicationData) => {
  try {
    const publication = await Publication.create(publicationData);
    return publication;
  } catch (error) {
    throw error;
  }
};

export const getAllPublications = async () => {
  try {
    const publications = await Publication.findAll({
      include: [
        {
          model: User,
          as: 'Author',
          attributes: ['id', 'name', 'surname', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return publications;
  } catch (error) {
    throw error;
  }
};

export const getPublicationById = async (publicationId) => {
  try {
    const publication = await Publication.findByPk(publicationId, {
      include: [
        {
          model: User,
          as: 'Author',
          attributes: ['id', 'name', 'surname', 'username'],
        },
      ],
    });
    return publication;
  } catch (error) {
    throw error;
  }
};

export const updatePublication = async (publicationId, updateData) => {
  try {
    const publication = await Publication.findByPk(publicationId);
    if (!publication) {
      return null;
    }
    const updated = await publication.update(updateData);
    return updated;
  } catch (error) {
    throw error;
  }
};

export const deletePublication = async (publicationId) => {
  try {
    const publication = await Publication.findByPk(publicationId);
    if (!publication) {
      return false;
    }
    await publication.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

export const getPublicationsByAuthor = async (authorId) => {
  try {
    const publications = await Publication.findAll({
      where: { AuthorId: authorId },
      include: [
        {
          model: User,
          as: 'Author',
          attributes: ['id', 'name', 'surname', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return publications;
  } catch (error) {
    throw error;
  }
};
