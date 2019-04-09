import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ApiException } from '../../bing/common/enums/api.exception';
// import { ApiErrorCode } from '../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { Focus } from '../../entitys/focus.entity';

@Injectable()
export class FocusService {
  constructor(
    @InjectRepository(Focus)
    private readonly focusRepository: Repository<Focus>,
  ) {}
}
