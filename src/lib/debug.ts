/**
 * Debug mode state from environment variables
 * Can be controlled via NEXT_PUBLIC_DEBUG_MODE environment variable
 */
export const isDebugMode =
  process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' ||
  (typeof window !== 'undefined' &&
    localStorage.getItem('debug-mode') === 'true');

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface DebugOptions {
  module?: string;
  level?: LogLevel;
}

/**
 * Debug logging function
 * @param message The log message
 * @param data Optional data object to log
 * @param options Logging options
 */
export function debugLog(
  message: string,
  data?: unknown,
  options: DebugOptions = {},
): void {
  if (!isDebugMode) return;

  const { module = 'APP', level = 'debug' } = options;
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${module}] [${level.toUpperCase()}]`;

  const logFn = console[level] || console.log;

  if (data !== undefined) {
    logFn(`${prefix} ${message}`, data);
  } else {
    logFn(`${prefix} ${message}`);
  }
}
