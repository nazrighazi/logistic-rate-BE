// Massage .env file to group settings by function

import { registerAs } from '@nestjs/config';

export interface IConfiguration {
  port: number;
  database: {
    host: string;
    port: number;
  };
}

export default registerAs('configuration', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  },
}));
