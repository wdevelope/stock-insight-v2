import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Askboard } from './askboard.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Reply {
  @ApiProperty({ description: '리플레이 아이디' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '타이틀' })
  @Column()
  title: string;

  @ApiProperty({ description: '내용' })
  @Column()
  description: string;

  @ManyToOne(() => Askboard, (askboard) => askboard.replies)
  askboard: Askboard;
}
