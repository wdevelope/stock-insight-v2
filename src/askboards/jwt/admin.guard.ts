import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AskboardsRepository } from 'src/askboards/askboards.repository';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly askboardsRepository: AskboardsRepository,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const askBoardId = Number(request.params.id);

    // JWT 인증과 관련된 기본 canActivate 함수 실행
    const canActivate = super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    // JWT 인증 후 유저 정보
    const user = request.user;
    if (user.status === 'admin') {
      return true;
    }

    // 작성자가 본인의 게시글인지 확인
    const post = await this.askboardsRepository.findOneWith(askBoardId);
    if (post && post.user.id === user.id) {
      return true;
    }

    throw new ForbiddenException(
      'You are not authorized to access this resource.',
    );
  }
}
