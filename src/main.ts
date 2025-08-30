import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from 'src/config/env.config';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import helmet from 'helmet';

declare const module: any;
async function bootstrap() {
  // Declare json logging
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

  // Get env config
  const envConfigService = app.get(ConfigService);
  const envConfig = envConfigService.get<IConfiguration>('configuration');

  // Enable global logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Enable CORS
  app.enableCors({
    origin: envConfig?.cors?.origins || [],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable security headers
  app.use(helmet());

  await app.listen(envConfig?.port || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
