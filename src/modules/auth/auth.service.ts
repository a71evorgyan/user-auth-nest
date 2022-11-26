import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { INCORRECT_CREDENTIALS } from '../../common/exceptions/messages';
import { validateHash } from '../../common/utils';
import { UserService } from '../user/user.service';

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

  async login(username: string, pass: string) {
    const userData = await this.userService.getUser({
      username,
    });

    if (!userData) throw new UnauthorizedException(INCORRECT_CREDENTIALS);

    if (!validateHash(pass, userData.password))
      throw new UnauthorizedException(INCORRECT_CREDENTIALS);

    const payload = { username: userData.username, userId: userData._id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
