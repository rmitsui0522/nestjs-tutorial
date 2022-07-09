import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomClaims } from './jwt/claims';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Password } from '../users/valueObjects/Password';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { SignupUserDto } from '../users/dto/signup-user.dto';
import { UserNotFoundException } from '../users/exceptions/UserNotFoundException';

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
  ): Promise<Omit<UserEntity, 'password'> | null> {
    const user = await this.usersService.findOneWithPassword(userName);

    if (!user) {
      throw new UserNotFoundException(userName);
    }

    const isMatch = Password.compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
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
    if (user) {
      return this.issueJwtToken(user);
    }
  }
}
