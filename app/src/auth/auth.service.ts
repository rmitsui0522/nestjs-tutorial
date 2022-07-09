import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomClaims } from './jwt/claims';
import {
  ExcludePasswordUserEntity,
  UsersService,
} from '../users/users.service';
import { Password } from '../users/valueObjects/Password';
import { SigninUserDto } from './dto/signin-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';

class AuthenticatedResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUserByLocal(
    userName: string,
    pass: string,
  ): Promise<ExcludePasswordUserEntity> {
    const user = await this.usersService.findOneWithPassword(userName);
    const isMatch = Password.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const { password, ...others } = user;

    return others;
  }

  public async validateUserByClaims(
    claims: CustomClaims,
  ): Promise<ExcludePasswordUserEntity> {
    const user = await this.usersService.findOne(claims.userName);

    return user;
  }

  public async issueJwtToken(
    dto: SigninUserDto,
  ): Promise<AuthenticatedResponse> {
    const claims: CustomClaims = {
      id: dto.id,
      userName: dto.userName,
    };

    return {
      access_token: this.jwtService.sign(claims),
    };
  }

  public async signup(dto: SignupUserDto): Promise<AuthenticatedResponse> {
    const user = await this.usersService.create(dto);

    return this.issueJwtToken({
      id: user.id,
      userName: user.userName,
    });
  }
}
