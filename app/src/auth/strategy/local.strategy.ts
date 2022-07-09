import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ExcludePasswordUserEntity } from '../../users/users.service';

export const LOCAL_STRATEGY_KEY = 'local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'userName' });
  }

  async validate(
    userName: string,
    password: string,
  ): Promise<ExcludePasswordUserEntity> {
    return await this.authService.validateUserByLocal(userName, password);
  }
}
