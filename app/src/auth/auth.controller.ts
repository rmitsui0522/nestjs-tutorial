import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { UserEntity } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: Request) {
    const user = req.user as UserEntity;
    return this.authService.issueJwtToken({
      id: user.id,
      userName: user.userName,
    });
  }

  @Post('signup')
  async signup(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }
}
