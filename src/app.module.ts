import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { IConfiguration } from 'src/config/env.config';
import { validateEnv } from 'src/config/env.validation';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    // Import .env configuration with validation
    ConfigModule.forRoot({
      load: [configuration],
      validate: validateEnv,
    }),
    // Import throttler with .env configuration
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<IConfiguration>('configuration');
        return {
          throttlers: [
            {
              ttl: config?.throttlers?.ttl || 60000,
              limit: config?.throttlers?.limit || 10,
            },
          ],
        };
      },
    }),
  ],
})
export class AppModule {}
