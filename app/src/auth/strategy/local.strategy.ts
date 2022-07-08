import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'userName' });
  }

  async validate(
    userName: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.authService.validateUser(userName, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
