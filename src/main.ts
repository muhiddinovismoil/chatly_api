import { AppConfigOptions, appConfig } from '@config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as basicAuth from 'express-basic-auth';

import { AppModule } from './app';

const logger = new Logger('MAIN');

const collapsed = `setTimeout(() => {
    document.querySelectorAll('.opblock-tag').forEach(item => item.click())
    document.querySelector('.models-control').click()
  },200);
  `;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfigOptions>('app');
  app.use(compression());
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  app.use(
    '/api/docs',
    basicAuth({
      challenge: true,
      users: {
        admin: appConfig.doc_password,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Chatly API')
    .setDescription('API for Chatly system')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customJsStr: collapsed,
  });

  await app.listen(appConfig.port, () => {
    console.log(
      `Server is running on http://${appConfig.host}:${appConfig.port}`,
    );

    console.log(
      `Swagger route: http://${appConfig.host}:${appConfig.port}/api/docs`,
    );
  });
}

bootstrap()
  .then(() => {
    logger.log(`S/erver is running on port: ${process.env.APP_PORT}`);
  })
  .catch((err) => {
    logger.error(`Error is occured during initialization the server: [${err}]`);
  });
