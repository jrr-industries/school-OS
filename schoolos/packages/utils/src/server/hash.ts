import { createHash, randomBytes } from 'node:crypto';

export const HashUtils = {
  sha256: (data: string): string => {
    return createHash('sha256').update(data).digest('hex');
  },

  md5: (data: string): string => {
    return createHash('md5').update(data).digest('hex');
  },

  generateSalt: (length = 32): string => {
    return randomBytes(length).toString('hex');
  },

  hashWithSalt: (data: string, salt: string): string => {
    return createHash('sha256')
      .update(data + salt)
      .digest('hex');
  },
};
