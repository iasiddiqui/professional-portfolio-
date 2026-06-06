import { env } from '../config/env.js';

type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  environment: string;
  meta?: Record<string, unknown>;
}

class Logger {
  private write(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: env.NODE_ENV,
      ...(meta ? { meta } : {}),
    };

    const output = JSON.stringify(payload);

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.write('error', message, meta);
  }
}

export const logger = new Logger();
