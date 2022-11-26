import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { LoginResponse } from './entities/login.entity';
import { RegisterResponse } from './entities/register.entity';
import { UserInfoResponse } from './entities/userInfo.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { RegisterUserDto } from './dtos/register.dto';
import { LoginUserDto } from './dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: RegisterResponse })
  async registerUser(@Body() userCredentials: RegisterUserDto) {
    return this.userService.createUser(userCredentials);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: LoginResponse })
  async loginUser(@Request() req) {
    return this.authService.login(req.user.username, req.user.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: UserInfoResponse })
  getUserInfo(@Request() req) {
    return this.userService.getUserInfo(req.user.userId);
  }
}
