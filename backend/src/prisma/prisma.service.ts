import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// 프리즈마 클라이언트 서비스

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      Logger.log(
        `=============================================================`,
      );
      Logger.log('데이터베이스 연결성공');
      Logger.log(
        `=============================================================`,
      );
    } catch (error) {
      Logger.log(
        `=============================================================`,
      );
      Logger.error('데이터베이스 연결실패', error);
      Logger.log(
        `=============================================================`,
      );
    }
  }
}
