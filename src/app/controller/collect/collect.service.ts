import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { BbsMyCollectionList } from '../../entitys/myCollectionList.entity';
import { BbsUser } from '../../entitys/user.entity';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(BbsMyCollectionList)
    private readonly collectRepository: Repository<BbsMyCollectionList>,
    @InjectRepository(BbsUser)
    private readonly userRepository: Repository<BbsUser>,
  ) { }

  async account(data): Promise<any> {
    return '';
  }
  // get collect list
  async getCollectList(param): Promise<any> {
    let res;
    let totalRes;
    const pageCount = param.pageCount ? param.pageCount * 1 : 10;
    const page = param.page ? (param.page - 1) * 1 * pageCount : 0;
    const user = await this.userRepository.findOne({NICK_NAME: param.nickName});
    totalRes = await this.collectRepository.find({USER_ID: user.USER_ID});
    res = await this.collectRepository
          .createQueryBuilder('collectList')
          .where('collectList.USER_ID = :USER_ID', { USER_ID: user.USER_ID })
          .orderBy('collectList.ID', 'DESC')
          .skip(page)
          .take(pageCount)
          .getMany();
    const articleData = {
      articleList: res,
      total: totalRes.length,
    };
    return articleData;
  }
  // remove collect article
  async removeCollect(data): Promise<any> {
    const res = await this.collectRepository.find({ ARTICLE_ID: data.articleId });
    const result = await this.collectRepository.remove(res);
    if (result.length > 0) {
      return {message: '取消成功！'};
    } else {
      throw new ApiException('取消失败', ApiErrorCode.REMOVE_FAILT, HttpStatus.BAD_REQUEST);
    }
  }
}
