import {
  Controller,
  ParseFilePipe,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Users } from 'src/users/users.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('uploads')
@ApiBearerAuth('JWT-auth')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 이미지 s3 업로드, db 저장
  @ApiOperation({ summary: '업로드 API', description: '이미지를 업로드한다.' })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @CurrentUser() user: Users,
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const userId = user.id;
    const url = await this.uploadService.upload(
      userId,
      file.originalname,
      file.buffer,
    );
    return { url }; // URL 반환
  }

  // 이미지 불러올일 있을때
  @ApiOperation({
    summary: '이미지 불러오기 API',
    description: '이미지를 불러온다.',
  })
  @Get()
  async getImageUrl(@CurrentUser() user: Users): Promise<{ url: string }> {
    const url = await this.uploadService.findImageUrlByUserId(user.id);
    return { url }; // URL 반환
  }
}
