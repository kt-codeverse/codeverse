import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UuidGeneratorService } from '../../common/services/uuid-generator.service';
import { TestIdGeneratorService } from '../../common/services/test-id-generator.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: 'ID_GENERATOR',
      useClass:
        process.env.NODE_ENV === 'test'
          ? TestIdGeneratorService
          : UuidGeneratorService,
    },
    UserService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
