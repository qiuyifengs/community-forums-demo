import { Injectable, HttpStatus, Next } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { User } from '../../entitys/user.entity';

@Injectable()
export class DownloadService {
  constructor(
    @InjectRepository(User)
    private readonly signRepository: Repository<User>,
  ) {}
}
