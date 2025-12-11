import { ValidationError } from '@rapid/errors';

/**
 * Safely retrieves an environment variable with optional default value
 */
export function getEnvironmentVariable(
  name: string,
  defaultValue?: string
): string {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new ValidationError(`Environment variable ${name} is not set`);
  }
  return value;
}
