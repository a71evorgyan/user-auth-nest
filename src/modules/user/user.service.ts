import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { isEmpty } from 'lodash';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../auth/dtos/register.dto';
import { User } from '../../schemas/user.schema';
import { USER_ALREADY_EXISTS } from '../../common/exceptions/messages';
import { generateHash } from '../../common/utils';

@Injectable()
export class UserService {
  jwtService: JwtService;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: RegisterUserDto) {
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.username ||
      !userData.email ||
      !userData.password
    )
      throw new BadRequestException('Fill user required data'); // TODO

    const hashPassword = await generateHash(userData.password);

    const checkUserExist = await this.getUser({
      email: userData.email.toLowerCase(),
    });

    if (checkUserExist) throw new UnauthorizedException(USER_ALREADY_EXISTS);

    const user = await this.userModel.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email.toLowerCase(),
      password: hashPassword,
    });

    return user;
  }

  async getUser(userCredentials: { email?: string; username?: string }) {
    if (isEmpty(userCredentials)) return;

    const filter = {
      ...(userCredentials?.username && { username: userCredentials.username }),
      ...(userCredentials?.email && { email: userCredentials.email }),
    };

    return this.userModel.findOne(filter).lean();
  }

  async getUserById(id: string) {
    return this.userModel.findById(id, { password: 0 }).lean();
  }

  async getUserInfo(id: string) {
    const user = await this.getUserById(id);
    const { _id, createdAt, updatedAt, ...rest } = user;
    return rest;
  }
}
