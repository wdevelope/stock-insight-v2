import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StockCommentService } from './stockcomment.service';
import { StockCommentDto } from './dto/stockcomment.dto';
import { Stock } from 'src/stock/entities/stock.entity';
import { StockComment } from './entities/stockcomment.entity';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('stockcomment')
@Controller('api/stocks')
export class StockCommentController {
  constructor(private readonly stockcommentService: StockCommentService) {}

  @Post('/:id/stockcomment')
  @ApiOperation({
    summary: '댓글 생성 API.',
    description: '댓글을 생성한다.',
  })
  @ApiBody({ type: [StockCommentDto] })
  create(
    @CurrentUser() user: Users,
    @Param('id') stock: Stock,
    @Body(ValidationPipe) stockCommentDto: StockCommentDto,
  ) {
    return this.stockcommentService.create(user, stockCommentDto, stock);
  }

  @Get('/:id/stockcomment')
  @ApiOperation({
    summary: '댓글 조회(boardId) API.',
    description: '댓글을 조회(boardId) 한다.',
  })
  findAllByBoard(@Param('id') id: string): Promise<StockComment[]> {
    return this.stockcommentService.findAllByStock(id);
  }

  @Patch('/:id/stockcomment/:stockcommentId')
  @ApiOperation({
    summary: '댓글 수정 API.',
    description: '댓글을 수정한다.',
  })
  @ApiBody({ type: [StockCommentDto] })
  update(
    @CurrentUser() user: Users,
    @Param('id') id: string,
    @Param('stockcommentId') stockcommentId: number,
    @Body(ValidationPipe) stockcommentDto: StockCommentDto,
  ) {
    return this.stockcommentService.update(
      user,
      id,
      stockcommentId,
      stockcommentDto,
    );
  }

  @Delete('/:id/stockcomment/:stockcommentId')
  @ApiOperation({
    summary: '댓글 삭제 API.',
    description: '댓글을 삭제한다.',
  })
  remove(
    @CurrentUser() user: Users,
    @Param('id') id: string,
    @Param('stockcommentId') stockcommentId: number,
  ) {
    return this.stockcommentService.remove(user, id, stockcommentId);
  }
}
