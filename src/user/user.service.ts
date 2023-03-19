import { PrismaService } from '@app/prisma';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { loginDto, registerDto } from './_dto/users.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  comparePassword(password, hashedPassword) {
    return new Promise((resolve) => {
      bcrypt.compare(password, hashedPassword, function (err, result) {
        if (err) throw new InternalServerErrorException(err);
        resolve(result);
      });
    });
  }

  private hash = (str): Promise<string> => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(str, 10, function (err, hash) {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  };

  createToken(obj, expiresIn) {
    return jwt.sign(obj, process.env.JWT_SECRETKEY, {
      expiresIn: expiresIn,
    });
  }

  createAccessAndRefreshToken(user) {
    const access_token = this.createToken(
      {
        email: user.email,
        user_id: user.user_id,
      },
      '60m',
    );
    const refresh_token = this.createToken(
      {
        email: user.email,
        user_id: user.user_id,
      },
      '60d',
    );
    return { access_token, refresh_token };
  }

  async register(userData: registerDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...userData,
          password: await this.hash(userData.password),
        },
      });
      return user;
    } catch (e) {
      console.log(e.message);
    }
  }

  getSafeFields(user) {
    return {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
    };
  }

  async login(loginBody: loginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginBody.email,
      },
    });

    if (!user) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (!(await this.comparePassword(loginBody.password, user.password))) {
      throw new BadRequestException('EMAIL_OR_PASSWORD_NOT_CORRECT');
    }
    return {
      user: this.getSafeFields(user),
      ...this.createAccessAndRefreshToken(user),
    };
  }
}
