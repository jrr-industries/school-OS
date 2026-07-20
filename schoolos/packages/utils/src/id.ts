import { nanoid } from 'nanoid';

export const IdUtils = {
  generate: (size = 21): string => {
    return nanoid(size);
  },

  generateShort: (): string => {
    return nanoid(8);
  },

  generateNumeric: (length = 6): string => {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  generatePrefix: (prefix: string, size = 16): string => {
    return `${prefix}_${nanoid(size)}`;
  },

  generateSlug: (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },

  isValidUUID: (value: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },
};
