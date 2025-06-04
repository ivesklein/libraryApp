import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'pass' })
  @IsNotEmpty()
  @IsString()
  password: string;
}