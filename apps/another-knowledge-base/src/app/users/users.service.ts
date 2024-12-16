import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { EnvTransformedValues, ExceptionMessages, ResponseItem } from '@pvz-backends/shared';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {
  }

  async auth(authDto: AuthDto): Promise<ResponseItem<string>> {
    const userExists = await this.userRepository.findOne({
      where: {
        email: authDto.email
      },
      withDeleted: false
    });

    if (!userExists?.created) {
      return {
        success: false,
        item: null,
        message: ExceptionMessages.UserNotFound
      };
    }

    if (await bcrypt.compare(authDto.password, userExists.password) === false) {
      return {
        success: false,
        item: null,
        message: ExceptionMessages.WrongPassword
      };
    }

    const xtoken = await this.jwtService.signAsync({
      id: userExists.id,
      email: authDto.email
    }, {
      secret: EnvTransformedValues().secret_word().value,
      expiresIn: EnvTransformedValues().expires_in().value
    });

    return {
      success: true,
      item: xtoken
    };
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseItem<UserEntity>> {
    const userExists = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      },
      withDeleted: true
    });

    if (userExists?.created) {
      return {
        success: false,
        item: null,
        message: ExceptionMessages.UserExists
      };
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userRepository.save(createUserDto);

    return {
      success: true,
      item: newUser
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseItem<UserEntity>> {
    const userExists = await this.userRepository.findOne({
      where: {
        id
      }
    });

    if (!userExists?.created) {
      return {
        success: false,
        item: null,
        message: ExceptionMessages.UserNotFound
      };
    }

    if (updateUserDto?.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.save({
      id,
      ...updateUserDto
    });

    return {
      success: true,
      item: updatedUser,
      message: 'Пользователь обновлен успешно! Старые токены для авторизации этого пользователя теперь недоступны.'
    };
  }

  async delete(id: number): Promise<ResponseItem<null>> {
    const userExists = await this.userRepository.findOne({
      where: {
        id
      }
    });

    if (!userExists?.created) {
      return {
        success: false,
        item: null,
        message: ExceptionMessages.UserNotFound
      };
    }

    await this.userRepository.softDelete({
      id
    });

    return {
      success: true,
      item: null,
      message: 'Пользователь удален успешно! Авторизация этого пользователя теперь недоступна.'
    };
  }
}
