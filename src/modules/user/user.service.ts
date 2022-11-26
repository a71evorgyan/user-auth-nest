import { Model } from 'mongoose';
import { isEmpty } from 'lodash';
import { ConflictException, Injectable } from '@nestjs/common';
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

  async createUser(userCredentials: RegisterUserDto) {
    const existingUser = await this.getUser({
      username: userCredentials.username,
      email: userCredentials.email.toLowerCase(),
    });
    if (existingUser) throw new ConflictException(USER_ALREADY_EXISTS);

    const hashPassword = await generateHash(userCredentials.password);

    const user = await this.userModel.create({
      firstName: userCredentials.firstName,
      lastName: userCredentials.lastName,
      username: userCredentials.username,
      email: userCredentials.email.toLowerCase(),
      password: hashPassword,
    });

    return user;
  }

  async getUser(userCredentials: { email?: string; username?: string }) {
    if (isEmpty(userCredentials)) return;

    const filter = {
      $or: [
        userCredentials?.username && { username: userCredentials.username },
        userCredentials?.email && { email: userCredentials.email },
      ],
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
