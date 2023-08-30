import { Module } from '@nestjs/common';
import { AskboardsService } from './askboards.service';
import { AskboardsController } from './askboards.controller';
import { AskboardsRepository } from './askboards.repository';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Askboard } from './entities/askboard.entity';
import { Reply } from './entities/reply.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Askboard, AskboardsRepository, Reply]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  controllers: [AskboardsController],
  providers: [AskboardsService, AskboardsRepository],
  exports: [TypeOrmModule, AskboardsService],
})
export class AskboardsModule {}
