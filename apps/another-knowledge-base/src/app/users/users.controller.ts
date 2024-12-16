import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { OnlyAnonymous, ResponseItem } from '@pvz-backends/shared';
import { UserEntity } from './entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@pvz-backends/auth-module';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('x-token')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @OnlyAnonymous()
  @Post('auth')
  auth(@Body() authDto: AuthDto): Promise<ResponseItem<string>> {
    return this.usersService.auth(authDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseItem<UserEntity>> {
    return this.usersService.create(createUserDto);
  }

  @ApiParam({ name: 'id', schema: { type: 'number', example: 1 } })
  @ApiBody({
    type: CreateUserDto
  })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<ResponseItem<UserEntity>> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiParam({ name: 'id', schema: { type: 'number', example: 1 } })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<null>> {
    return this.usersService.delete(id);
  }

}
