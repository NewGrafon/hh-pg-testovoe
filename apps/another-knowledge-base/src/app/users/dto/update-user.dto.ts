import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDtoInterface } from '../../../common/interfaces/users.interfaces';

export class UpdateUserDto extends PartialType(CreateUserDto) implements UpdateUserDtoInterface {
}
