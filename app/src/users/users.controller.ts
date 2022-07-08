import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userName')
  findOne(@Param('userName') userName: UserEntity['userName']) {
    return this.usersService.findOne(userName);
  }

  @Patch(':userName')
  update(
    @Param('userName') userName: UserEntity['userName'],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userName, updateUserDto);
  }

  @Delete(':userName')
  remove(@Param('userName') userName: UserEntity['userName']) {
    return this.usersService.remove(userName);
  }
}
