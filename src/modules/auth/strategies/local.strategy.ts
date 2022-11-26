import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  INVALID_PASSWORD_LENGTH,
  INVALID_REQUEST_BODY,
} from '../../../common/exceptions/messages';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    if (!username || !password)
      throw new BadRequestException(INVALID_REQUEST_BODY);

    if (password.length < 8) {
      throw new BadRequestException(INVALID_PASSWORD_LENGTH);
    }

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
