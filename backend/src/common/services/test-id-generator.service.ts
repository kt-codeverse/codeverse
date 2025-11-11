import { Injectable } from '@nestjs/common';
import { IdGenerator } from '../interfaces/id-generator.interface';

@Injectable()
export class TestIdGeneratorService implements IdGenerator {
  generate(): string {
    return `test-${Math.random().toString(36).substring(2, 10)}`;
  }
}
