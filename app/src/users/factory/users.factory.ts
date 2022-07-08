import { Injectable } from '@nestjs/common';
import { RolesService } from '../../roles/roles.service';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserName } from '../valueObjects/UserName';
import { Email } from '../valueObjects/Email';
import { Password } from '../valueObjects/Password';

@Injectable()
export class UsersFactory {
  constructor(private rolesService: RolesService) {}

  public async build(dto: CreateUserDto): Promise<Omit<UserEntity, 'id'>> {
    const userName = new UserName(dto.userName).value();
    const email = new Email(dto.email).value();
    const password = new Password(dto.password).value();

    const role = await this.rolesService.findOne(dto.roleId);

    return { userName, email, password, role };
  }
}
