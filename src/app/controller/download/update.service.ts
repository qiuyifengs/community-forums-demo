import { Injectable, HttpStatus, Next } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { BbsUser } from '../../entitys/user.entity';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(BbsUser)
    private readonly signRepository: Repository<BbsUser>,
  ) {}
}
