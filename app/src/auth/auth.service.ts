import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomClaims } from './jwt/claims';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Password } from '../users/valueObjects/Password';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { SignupUserDto } from '../users/dto/signup-user.dto';

class AuthenticatedResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
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

  public async signin(dto: SigninUserDto): Promise<AuthenticatedResponse> {
    const claims: CustomClaims = {
      id: dto.id,
      sub: dto.userName,
    };
    return {
      access_token: this.jwtService.sign(claims),
    };
  }

  public async signup(dto: SignupUserDto): Promise<AuthenticatedResponse> {
    const user = await this.usersService.create(dto);
    if (user) {
      return this.signin(user);
    }
  }
}
