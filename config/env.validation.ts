import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

class EnvConfiguration {
  @IsString()
  PORT: string;

  @IsString()
  DATABASE_HOST: string;

  @IsString()
  DATABASE_PORT: string;

  @IsString()
  THROTTLER_TTL: string;

  @IsString()
  THROTTLER_LIMIT: string;

  @IsString()
  CORS_ORIGINS: string;
}

// Validate .env file
export function validateEnv(config: Record<string, unknown>) {
  const instance = plainToInstance(EnvConfiguration, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(instance, {
    skipMissingProperties: false, // Set as false for now, will revisit later
  });
  if (errors.length > 0) {
    throw new Error(
      'Configuration validation failed: ' + JSON.stringify(errors),
    );
  }

  return config;
}
