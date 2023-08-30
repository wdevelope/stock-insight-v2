import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';

export class FindBoardDto extends PartialType(CreateBoardDto) {
  title?: string;
  description?: string;
}
