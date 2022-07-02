import { Injectable } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Password } from '../users/valueObjects/Password';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    userName: string,
    pass: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOneWithPassword(userName);
    const isMatch = await new Password(pass).compare(user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result as UserEntity;
    }
    return null;
  }
}
