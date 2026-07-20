export const SCHOOL_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  HIGHER_SECONDARY: 'higher_secondary',
  K12: 'k12',
  PRESCHOOL: 'preschool',
  VOCATIONAL: 'vocational',
  SPECIAL_EDUCATION: 'special_education',
} as const;

export type SchoolType = (typeof SCHOOL_TYPES)[keyof typeof SCHOOL_TYPES];

export const SCHOOL_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
  TRIAL: 'trial',
} as const;

export type SchoolStatus = (typeof SCHOOL_STATUS)[keyof typeof SCHOOL_STATUS];

export const SCHOOL_CURRICULUM = {
  CBSE: 'cbse',
  ICSE: 'icse',
  STATE_BOARD: 'state_board',
  IB: 'ib',
  CAMBRIDGE: 'cambridge',
  MONTESSORI: 'montessori',
  WALDORF: 'waldorf',
} as const;

export type SchoolCurriculum = (typeof SCHOOL_CURRICULUM)[keyof typeof SCHOOL_CURRICULUM];
