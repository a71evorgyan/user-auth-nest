import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { USER_NOT_FOUND } from '../../common/exceptions/messages';
import { validateHash } from '../../common/utils';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.getUser({ username });
    if (user && validateHash(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginUserDto) {
    const userData = await this.userService.getUser({
      username: user.username,
    });

    if (!userData) throw new UnauthorizedException(USER_NOT_FOUND);

    if (!validateHash(user.password, userData.password))
      throw new UnauthorizedException();

    const payload = { username: userData.username, userId: userData._id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
