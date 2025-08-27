import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from 'config/configuration';

async function bootstrap() {
  // Enable json logging
  const logger = {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
    }),
  };

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    logger,
  );

  // Declare swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Logistic Rate Documentation')
    .setDescription('The Logistic Rate API description')
    .setVersion('1.0')
    .addTag('logistic-rate')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  const envConfigService = app.get(ConfigService);
  const envConfig = envConfigService.get<IConfiguration>('configuration');

  await app.listen(envConfig?.port || 3000);
}
bootstrap();
