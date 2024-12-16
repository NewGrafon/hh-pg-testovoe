import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthDtoInterface } from '../../../common/interfaces/users.interfaces';

export class AuthDto implements AuthDtoInterface {
  @ApiProperty({ title: 'Эл. почта', example: 'email@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ title: 'Пароль', example: 'password' })
  @IsString()
  @MinLength(8)
  password: string;
}
