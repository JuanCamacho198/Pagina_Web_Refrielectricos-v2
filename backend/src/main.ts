import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  // Configuración de Winston
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          process.env.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.printf(
                  ({ timestamp, level, message, context, ms }) => {
                    return `${timestamp as string} [${
                      (context as string) || 'Application'
                    }] ${level}: ${message as string} ${ms as string}`;
                  },
                ),
              ),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  // Security Headers
  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración simplificada y robusta de CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'https://frontend-production-4178.up.railway.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4000',
      'http://localhost:8080',
    ].filter((url): url is string => !!url),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Refrielectricos API')
    .setDescription('API para el eCommerce de Refrielectricos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // IMPORTANTE: Escuchar en 0.0.0.0 para contenedores Docker/Railway
  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Listening on port: ${port}`);
}
void bootstrap();
