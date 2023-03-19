import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
  return decoded;
};

export const User = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const authHeader = request.get('Authorization');
    if (!authHeader) throw new UnauthorizedException('NO_AUTH');

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new BadRequestException('INVALID_TOKEN');
    }
    try {
      const decoded = decodeToken(token);
      return decoded;
    } catch (e) {
      throw new UnauthorizedException('NO_AUTH');
    }
  },
);
