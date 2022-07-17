import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomClaims } from '../jwt/claims';
import { AuthService } from '../auth.service';
import { ExcludePasswordUserEntity } from '../../users/users.service';

export const JWT_STRATEGY_KEY = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('auth.jwt.secret', 'JWT_SECRET'),
    });
  }

  // TODO: リフレッシュトークン実装
  async validate(claims: CustomClaims): Promise<ExcludePasswordUserEntity> {
    return await this.authService.validateUserByClaims(claims);
  }
}
