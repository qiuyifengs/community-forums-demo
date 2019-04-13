import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { MyCollectionList } from '../../entitys/myCollectionList.entity';
import { User } from '../../entitys/user.entity';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(MyCollectionList)
    private readonly collectRepository: Repository<MyCollectionList>,
    @InjectRepository(User)
    private readonly userCommentRepository: Repository<User>,
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
    const user = await this.userCommentRepository.findOne({nickName: param.nickName});
    totalRes = await this.collectRepository.find({userId: user.userId});
    res = await this.collectRepository
          .createQueryBuilder('collectList')
          .where('collectList.userId = :userId', { userId: user.userId })
          .orderBy('collectList.serialNum', 'DESC')
          .skip(page)
          .take(pageCount)
          .getMany();
    res.forEach((item, ind) => {
        res[ind].articleContent = item.articleContent.substr(2).substring(0, item.articleContent.length - 4).replace('","', '\n');
    });
    const articleData = {
      articleList: res,
      total: totalRes.length,
  };
    return articleData;
  }
  // remove collect article
  async removeCollect(data): Promise<any> {
    const res = await this.collectRepository.find({ articleId: data.articleId });
    const result = await this.collectRepository.remove(res);
    if (result.length > 0) {
      return {message: '取消成功！'};
    } else {
      throw new ApiException('取消失败', ApiErrorCode.REMOVE_FAILT, HttpStatus.BAD_REQUEST);
    }
  }
}
