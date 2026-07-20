import pino from 'pino';

let loggerInstance: pino.Logger | null = null;

export function createLogger(name: string, level = 'info'): pino.Logger {
  if (loggerInstance) {
    return loggerInstance.child({ module: name });
  }

  const isProduction = process.env.NODE_ENV === 'production';

  loggerInstance = pino({
    name,
    level,
    transport: isProduction
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
    serializers: {
      error: pino.stdSerializers.err,
      request: pino.stdSerializers.req,
      response: pino.stdSerializers.res,
    },
    redact: {
      paths: ['password', 'secret', 'token', 'authorization', 'cookie'],
      censor: '[REDACTED]',
    },
  });

  return loggerInstance;
}

export const Logger = {
  info: (module: string, message: string, ...args: unknown[]): void => {
    createLogger(module).info(message, ...args);
  },

  error: (module: string, message: string, error?: Error, ...args: unknown[]): void => {
    createLogger(module).error({ error, ...args }, message);
  },

  warn: (module: string, message: string, ...args: unknown[]): void => {
    createLogger(module).warn(message, ...args);
  },

  debug: (module: string, message: string, ...args: unknown[]): void => {
    createLogger(module).debug(message, ...args);
  },
};
