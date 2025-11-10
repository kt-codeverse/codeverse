import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/HttpExceptionFilter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = app.get(ConfigService).getOrThrow<number>('PORT');

  // cors 활성화
  app.enableCors();

  // 전역 validation 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 전역 예외 필터 등록
  app.useGlobalFilters(new HttpExceptionFilter());

  // 로깅
  console.log('--- 환경변수 ---');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('PORT:', process.env.PORT);
  console.log('------------------------------------');

  await app.listen(PORT);
}

void bootstrap();
