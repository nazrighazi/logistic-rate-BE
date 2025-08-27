// Massage .env file to group settings by function

import { registerAs } from '@nestjs/config';

export interface IConfiguration {
  port: number;
  database: {
    host: string;
    port: number;
  };
  throttlers: {
    ttl: number;
    limit: number;
  };
  cors: {
    origins: string[];
  };
}

export default registerAs('configuration', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  },
  throttlers: {
    ttl: parseInt(process.env.THROTTLER_TTL || '60000', 10),
    limit: parseInt(process.env.THROTTLER_LIMIT || '10', 10),
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || ['http://localhost:3000'],
  },
}));
