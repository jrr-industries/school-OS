export interface LoginParams {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
  schoolId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    schoolId: string;
    roles: string[];
    permissions: string[];
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  };
}

export interface SessionPayload {
  userId: string;
  schoolId: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
}
