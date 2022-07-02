import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserName } from '../valueObjects/UserName';
import { Email } from '../valueObjects/Email';
import { Password } from '../valueObjects/Password';

@Injectable()
export class UsersFactory {
  public async build(dto: CreateUserDto): Promise<UserEntity> {
    const userName = new UserName(dto.userName).value();
    const email = new Email(dto.email).value();
    const password = await new Password(dto.password).hashValue();

    return { id: null, userName, email, password };
  }
}
