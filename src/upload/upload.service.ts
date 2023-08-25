import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),

    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  // 파일 업로드
  async upload(fileName: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'w-node-test',
        Key: fileName,
        Body: file,
      }),
    );
  }

  // 파일 가져오기
  async getFileUrl(fileName: string = 'default.jpg'): Promise<string> {
    const region = this.configService.getOrThrow('AWS_S3_REGION');

    const fileUrl = `https://w-node-test.s3.${region}.amazonaws.com/${fileName}`;
    return fileUrl;
  }
}
