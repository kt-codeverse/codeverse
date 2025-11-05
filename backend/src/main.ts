import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/HttpExceptionFilter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // cors 활성화

  // 전역 validation 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('SERVER_PORT') || 3000;

  // 전역 예외 필터 등록
  app.useGlobalFilters(new HttpExceptionFilter());

  // 개발 환경일 때 실행 URL 로깅
  if (configService.get('NODE_ENV') === 'development') {
    Logger.log(`Application running on port ${PORT}, http://localhost:${PORT}`);
  }

  await app.listen(PORT);
}

void bootstrap();
