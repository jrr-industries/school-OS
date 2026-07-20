export const SlugUtils = {
  generate: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  generateUnique: (text: string, suffix?: string): string => {
    const slug = SlugUtils.generate(text);
    const unique = suffix ?? Date.now().toString(36);
    return `${slug}-${unique}`;
  },

  isValid: (slug: string): boolean => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  },
};
