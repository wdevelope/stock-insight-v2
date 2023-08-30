import { Injectable, NotFoundException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  // 파일 업로드
  async upload(
    userId: number,
    fileName: string,
    file: Buffer,
  ): Promise<string> {
    // 여기서 새로운 파일 이름을 생성
    const randomString = uuidv4();
    const newFileName = `${randomString}-${fileName}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'w-node-test',
        Key: newFileName,
        Body: file,
      }),
    );
    const fileUrl = await this.getFileUrl(newFileName);

    // users 테이블에 이미지 URL 저장
    await this.userRepository.update(userId, { imgUrl: fileUrl });

    return fileUrl;
  }

  // url 가져오기
  async getFileUrl(fileName: string = 'default.jpg'): Promise<string> {
    const region = this.configService.getOrThrow('AWS_S3_REGION');

    const fileUrl = `https://w-node-test.s3.${region}.amazonaws.com/${fileName}`;
    return fileUrl;
  }

  // 파일 가져오기
  async findImageUrlByUserId(userId: number): Promise<string> {
    // userId를 기반으로 데이터베이스에서 이미지 URL을 찾습니다.
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.imgUrl;
  }
}
