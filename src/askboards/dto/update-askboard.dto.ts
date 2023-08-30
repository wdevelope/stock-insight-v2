import { PartialType } from '@nestjs/mapped-types';
import { CreateAskboardDto } from './create-askboard.dto';

export class UpdateAskboardDto extends PartialType(CreateAskboardDto) {}
