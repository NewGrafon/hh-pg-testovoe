import { EntityBaseInterface } from '@testovoe/shared';

export interface AuthDtoInterface {
  email: string;
  password: string;
}

export interface CreateUserDtoInterface {
  email: string;
  password: string;
}

export interface UpdateUserDtoInterface extends Partial<CreateUserDtoInterface> {
}

export interface UserEntityInterface extends CreateUserDtoInterface, EntityBaseInterface {
}
