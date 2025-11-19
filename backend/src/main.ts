import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import type { Express, Request, Response } from 'express';
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
  const enableSwaggerEnv = configService.get<string>('ENABLE_SWAGGER');
  const isDev = configService.get('NODE_ENV') === 'development';
  const enableSwaggerFlag =
    isDev ||
    enableSwaggerEnv === 'true' ||
    enableSwaggerEnv === '1' ||
    enableSwaggerEnv === 'yes';

  if (enableSwaggerFlag) {
    const swaggerBase =
      configService.get<string>('SWAGGER_BASE_URL') ||
      `http://localhost:${PORT}`;

    const config = new DocumentBuilder()
      .setTitle('TripNest API')
      .setDescription('API 문서')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

    document.servers = [{ url: `${swaggerBase}` }];

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        url: `${swaggerBase}/api-json`,
      },
    });
    Logger.log(
      `Swagger enabled (NODE_ENV=${configService.get('NODE_ENV')}, ENABLE_SWAGGER=${enableSwaggerEnv}). UI: ${swaggerBase}/docs`,
    );

    // Express 레벨에서 OpenAPI JSON을 두 경로로 노출합니다.
    // 이유: 리버스 프록시(Caddy) 설정에 따라 요청 경로가
    // `/api-json` 또는 `/api/api-json` 으로 전달될 수 있으므로
    // 두 경로 모두를 지원해 Swagger UI와 외부 클라이언트가
    // 올바른 문서를 가져가도록 보장합니다.
    try {
      // Nest의 HTTP 어댑터에서 원본 Express 인스턴스를 가져옵니다.
      // `use`로 미들웨어를 등록하면 Nest의 라우터보다 앞서 요청을 처리합니다.
      const expressApp = app.getHttpAdapter().getInstance() as Express;
      expressApp.use('/api-json', (_req: Request, res: Response) =>
        res.json(document),
      );
      expressApp.use('/api/api-json', (_req: Request, res: Response) =>
        res.json(document),
      );
    } catch (err: unknown) {
      // 실패해도 앱 실행에는 영향을 주지 않으므로 로그로 남깁니다.
      Logger.warn(
        `Failed to register raw express routes for api-json: ${String(err)}`,
      );
    }
  } else {
    Logger.log(
      `Swagger disabled (NODE_ENV=${configService.get('NODE_ENV')}, ENABLE_SWAGGER=${enableSwaggerEnv}).`,
    );
  }

  // 모든 API 경로를 `/api` 로 통일합니다. (리버스 프록시에서 `/api`로 전달될 때 라우팅 일관성을 유지)
  app.setGlobalPrefix('api');

  await app.listen(PORT, () => {
    Logger.log(`=============================================================`);
    Logger.log(`Application running on port ${PORT}, http://localhost:${PORT}`);
    Logger.log(`=============================================================`);
  });
}
//
void bootstrap();
