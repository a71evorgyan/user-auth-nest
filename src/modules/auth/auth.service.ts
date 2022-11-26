import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../../schemas/user.schema';
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
    const isValidPassword = await validateHash(pass, user.password);
    if (user && isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userCredentials: UserDocument) {
    const payload = {
      username: userCredentials.username,
      userId: userCredentials._id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
