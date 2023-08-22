import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticeboardDto } from './create-noticeboard.dto';

export class UpdateNoticeboardDto extends PartialType(CreateNoticeboardDto) {
  title?: string;
  description?: string;
  image?: string;
}
