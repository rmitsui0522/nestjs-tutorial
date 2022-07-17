import { Injectable } from '@nestjs/common';
import { RolesService } from '../../roles/roles.service';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserName } from '../valueObjects/UserName';
import { Email } from '../valueObjects/Email';
import { Password } from '../valueObjects/Password';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ExcludePasswordUserEntity } from '../users.service';

@Injectable()
export class UsersFactory {
  constructor(private rolesService: RolesService) {}

  public async buildNewUser(
    dto: CreateUserDto,
  ): Promise<Omit<UserEntity, 'id'>> {
    const userName = new UserName(dto.userName).value();
    const email = new Email(dto.email).value();
    const password = new Password(dto.password).value();

    // TODO: roleIdがfalsyであるときのエラーハンドリング
    const role = await this.rolesService.findOne(dto.roleId);

    return { userName, email, password, role };
  }

  public async buildUpdateUser(
    dto: UpdateUserDto,
    targetUser: ExcludePasswordUserEntity,
  ): Promise<
    Partial<UserEntity> & {
      email: UserEntity['email'];
      userName: UserEntity['userName'];
    }
  > {
    const newValues = {};

    if (dto.userName) {
      newValues['userName'] = new UserName(dto.userName).value();
    }

    if (dto.email) {
      newValues['email'] = new Email(dto.email).value();
    }

    if (dto.password) {
      newValues['password'] = new Password(dto.password).value();
    }

    if (dto.roleId) {
      newValues['role'] = await this.rolesService.findOne(dto.roleId);
    }

    return { ...targetUser, ...newValues };
  }
}
