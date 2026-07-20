import {
  format,
  formatDistanceToNow,
  parseISO,
  differenceInDays,
  differenceInHours,
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isAfter,
  isBefore,
  isWithinInterval,
} from 'date-fns';

export const DateUtils = {
  format: (date: Date | string, pattern: string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern);
  },

  formatRelative: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  },

  formatDate: (date: Date | string): string => {
    return DateUtils.format(date, 'PPP');
  },

  formatDateTime: (date: Date | string): string => {
    return DateUtils.format(date, 'PPpp');
  },

  formatTime: (date: Date | string): string => {
    return DateUtils.format(date, 'p');
  },

  formatShort: (date: Date | string): string => {
    return DateUtils.format(date, 'MMM dd, yyyy');
  },

  formatISODate: (date: Date | string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return d.toISOString();
  },

  differenceInDays: (dateLeft: Date | string, dateRight: Date | string): number => {
    return differenceInDays(
      typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft,
      typeof dateRight === 'string' ? parseISO(dateRight) : dateRight,
    );
  },

  differenceInHours: (dateLeft: Date | string, dateRight: Date | string): number => {
    return differenceInHours(
      typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft,
      typeof dateRight === 'string' ? parseISO(dateRight) : dateRight,
    );
  },

  addDays: (date: Date | string, amount: number): Date => {
    return addDays(typeof date === 'string' ? parseISO(date) : date, amount);
  },

  addMonths: (date: Date | string, amount: number): Date => {
    return addMonths(typeof date === 'string' ? parseISO(date) : date, amount);
  },

  addYears: (date: Date | string, amount: number): Date => {
    return addYears(typeof date === 'string' ? parseISO(date) : date, amount);
  },

  startOfDay: (date: Date | string): Date => {
    return startOfDay(typeof date === 'string' ? parseISO(date) : date);
  },

  endOfDay: (date: Date | string): Date => {
    return endOfDay(typeof date === 'string' ? parseISO(date) : date);
  },

  startOfWeek: (date: Date | string): Date => {
    return startOfWeek(typeof date === 'string' ? parseISO(date) : date);
  },

  endOfWeek: (date: Date | string): Date => {
    return endOfWeek(typeof date === 'string' ? parseISO(date) : date);
  },

  startOfMonth: (date: Date | string): Date => {
    return startOfMonth(typeof date === 'string' ? parseISO(date) : date);
  },

  endOfMonth: (date: Date | string): Date => {
    return endOfMonth(typeof date === 'string' ? parseISO(date) : date);
  },

  startOfYear: (date: Date | string): Date => {
    return startOfYear(typeof date === 'string' ? parseISO(date) : date);
  },

  endOfYear: (date: Date | string): Date => {
    return endOfYear(typeof date === 'string' ? parseISO(date) : date);
  },

  isAfter: (date: Date | string, dateToCompare: Date | string): boolean => {
    return isAfter(
      typeof date === 'string' ? parseISO(date) : date,
      typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare,
    );
  },

  isBefore: (date: Date | string, dateToCompare: Date | string): boolean => {
    return isBefore(
      typeof date === 'string' ? parseISO(date) : date,
      typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare,
    );
  },

  isWithinRange: (
    date: Date | string,
    start: Date | string,
    end: Date | string,
  ): boolean => {
    return isWithinInterval(
      typeof date === 'string' ? parseISO(date) : date,
      {
        start: typeof start === 'string' ? parseISO(start) : start,
        end: typeof end === 'string' ? parseISO(end) : end,
      },
    );
  },
};
