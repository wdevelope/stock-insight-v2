import { SetMetadata } from '@nestjs/common';
import { Stat } from '../enum/status.enum';

export const STATUS_KEY = 'status';
export const Status = (...status: Stat[]) => SetMetadata(STATUS_KEY, status);
