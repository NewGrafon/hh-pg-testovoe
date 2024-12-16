import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { CreateUserDtoInterface } from '../../../common/interfaces/users.interfaces';

export class CreateUserDto implements CreateUserDtoInterface {
  @ApiProperty({ name: 'email', example: 'email@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ name: 'password', example: 'password' })
  @IsString()
  @MinLength(8)
  password: string;
}
