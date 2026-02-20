import { randomBytes } from 'crypto';

export const generateShortUUID = () => {
  const alphabet = '123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  const bytes = randomBytes(12);
  let result = '';

  for (let i = 0; i < 12; i++) {
    result += alphabet[bytes[i] % alphabet.length];
  }

  return result;
};

export const generateCommentId = () => {
  return `cmt_${generateShortUUID()}`;
};

export const isValidCommentId = (id) => {
  if (!id || typeof id !== 'string') return false;

  const pattern =
    /^cmt_[123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz]{12}$/;
  return pattern.test(id);
};
