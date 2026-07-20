import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';

export const CsvUtils = {
  serialize: <T extends Record<string, unknown>>(
    data: T[],
    columns?: string[],
  ): string => {
    const cols = columns ?? (data.length > 0 ? Object.keys(data[0]!) : []);
    return stringify(data, {
      header: true,
      columns: cols,
      delimiter: ',',
    });
  },

  deserialize: <T = Record<string, string>>(
    content: string,
    options?: { columns?: string[]; skipEmptyLines?: boolean },
  ): T[] => {
    return parse(content, {
      columns: options?.columns ?? true,
      skip_empty_lines: options?.skipEmptyLines ?? true,
      delimiter: ',',
      trim: true,
    }) as T[];
  },

  generateFilename: (prefix: string, extension = 'csv'): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}_${timestamp}.${extension}`;
  },
};
