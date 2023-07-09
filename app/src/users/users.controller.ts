import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { Permissions } from '../permissions/permissions.decorator';
import { Permission } from '../permissions/permisson.enum';

@Permissions(Permission.UsersReadable)
@UseGuards(PermissionsGuard)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions(Permission.UsersReadable)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: UserEntity['id']) {
    return this.usersService.findOne({ id });
  }

  @Permissions(Permission.UsersWritable)
  @Put(':id')
  update(
    @Param('id') id: UserEntity['id'],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Permissions(Permission.UsersWritable)
  @Delete(':id')
  remove(@Param('id') id: UserEntity['id']) {
    return this.usersService.remove(id);
  }
}
