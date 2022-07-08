import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { UsersService } from './users.service';
import { UsersFactory } from './factory/users.factory';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersFactory],
  exports: [UsersService],
})
export class UsersModule {}
