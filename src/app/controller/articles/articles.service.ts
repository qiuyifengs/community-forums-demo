import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ApiException } from '../../bing/common/enums/api.exception';
// import { ApiErrorCode } from '../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { User } from '../../entitys/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(User)
    private readonly articlesRepository: Repository<User>,
  ) {}

  async focus(data): Promise<any> {
    return '';
  }
}
