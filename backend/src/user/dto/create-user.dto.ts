import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'youminki@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  passwordConfirm: string;

  @ApiProperty({ example: '사용자123' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+821012341234' })
  @IsNotEmpty()
  @Matches(/^[+0-9\-\s]+$/)
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatar?: string;
}
