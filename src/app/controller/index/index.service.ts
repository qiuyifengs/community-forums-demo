import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { Menu } from '../../entitys/menuList.entity';
import { User } from '../../entitys/user.entity';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable()
export class IndexService {
    constructor(
        @InjectRepository(PostList)
        private readonly indexRepository: Repository<PostList>,
        @InjectRepository(ArticleDetail)
        private readonly articleRepository: Repository<ArticleDetail>,
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // getPostList
    async getPostList(data): Promise<any> {
        let res;
        let totalRes;
        const pageCount = data.pageCount ? data.pageCount * 1 : 10;
        const page = data.page ? data.page * 1 * pageCount : 0;
        const menuList = await this.menuRepository.find();
        if (data.articleType && data.articleType !== 'ALL' && data.articleType !== 'HOT') {
            totalRes = await this.indexRepository.find({ articleType: data.articleType, isDrafts: false });
            res = await this.indexRepository
              .createQueryBuilder('postList')
              .where('postList.articleType = :articleType', { articleType: data.articleType })
              .andWhere('postList.isDrafts = :isDrafts', { isDrafts: false })
              .orderBy({
                'postList.top': 'DESC',
                'postList.serialNum': 'DESC',
              })
              .skip(page)
              .take(pageCount)
              .getMany();
        } else {
            totalRes = await this.indexRepository.find({ isDrafts: false });
            if (data.articleType !== 'HOT') {
              res = await this.indexRepository
                .createQueryBuilder('postList')
                .where('postList.isDrafts = :isDrafts', { isDrafts: false })
                .orderBy({
                  'postList.top': 'DESC',
                  'postList.serialNum': 'DESC',
                })
                .skip(page)
                .take(pageCount)
                .getMany();
            } else {
              res = await this.indexRepository
                .createQueryBuilder('postList')
                .where('postList.isDrafts = :isDrafts', { isDrafts: false })
                .orderBy({
                  'postList.top': 'DESC',
                  'postList.serialNum': 'DESC',
                })
                .skip(page)
                .take(pageCount)
                .getMany();
            }
        }
        for (const item of res) {
          const user = await this.userRepository.findOne({ userId: item.userId });
          item.articleContent = item.articleContent.substr(2).substring(0, item.articleContent.length - 4).replace('","', '\n');
          item.hearderIcon = user.headerIcon;
          item.author = user.nickName;
        }
        const articleData = {
          code: ApiErrorCode.SUCCESS,
          articleList: res,
          total: totalRes.length,
          menuList,
        };
        return articleData;
    }
    // add viewCount
    async viewCount(data): Promise<any> {
        const res = await this.indexRepository.findOne({ articleId: data.articleId});
        const upRes = await this.articleRepository.findOne({ articleId: data.articleId });
        res.viewCount += 1;
        upRes.viewCount = res.viewCount;
        await this.indexRepository.save(res);
        await this.articleRepository.save(upRes);
    }
}
