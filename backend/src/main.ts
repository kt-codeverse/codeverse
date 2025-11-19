import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/HttpExceptionFilter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 8080;

  // 설정 및 미들웨어
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // 스웨거 문서 등록
  // 개발 환경이거나 `ENABLE_SWAGGER` 가 truthy 한 값이면 활성화합니다.
  const enableSwaggerEnv = configService.get<any>('ENABLE_SWAGGER');
  const isDev = configService.get('NODE_ENV') === 'development';
  const enableSwaggerFlag =
    isDev ||
    enableSwaggerEnv === true ||
    enableSwaggerEnv === 'true' ||
    enableSwaggerEnv === '1' ||
    enableSwaggerEnv === 'yes';

  if (enableSwaggerFlag) {
    const swaggerBase = configService.get<string>('SWAGGER_BASE_URL') || `http://localhost:${PORT}`;

    const config = new DocumentBuilder()
      .setTitle('TripNest API')
      .setDescription('API 문서')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document: any = SwaggerModule.createDocument(app, config);
    // OpenAPI `servers` 필드에 외부 접근용 기본 URL을 설정합니다.
    document.servers = [{ url: swaggerBase }];

    SwaggerModule.setup('api', app, document);
    Logger.log(`Swagger enabled (NODE_ENV=${configService.get('NODE_ENV')}, ENABLE_SWAGGER=${enableSwaggerEnv}). UI: ${swaggerBase}/api`);
  } else {
    Logger.log(`Swagger disabled (NODE_ENV=${configService.get('NODE_ENV')}, ENABLE_SWAGGER=${enableSwaggerEnv}).`);
  }

  await app.listen(PORT, () => {
    Logger.log(`=============================================================`);
    Logger.log(`Application running on port ${PORT}, http://localhost:${PORT}`);
    Logger.log(`=============================================================`);
  });
}
//
void bootstrap();
