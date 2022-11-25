import { hash, compare } from 'bcrypt';

export const generateHash = (password: string) => {
  return hash(password, 10);
};

export const validateHash = async (password: string, hash: string) => {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return compare(password, hash);
};
