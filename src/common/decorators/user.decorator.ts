import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
// auth 유효성
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Users => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
