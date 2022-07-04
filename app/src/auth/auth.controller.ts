import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { SignupUserDto } from '../users/dto/signup-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Body() dto: SigninUserDto) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  async signup(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }
}
