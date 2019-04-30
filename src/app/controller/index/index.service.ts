import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { Menu } from '../../entitys/menuList.entity';
import { BbsUser } from '../../entitys/user.entity';

@Injectable()
export class IndexService {
    constructor(
        @InjectRepository(PostList)
        private readonly indexRepository: Repository<PostList>,
        @InjectRepository(ArticleDetail)
        private readonly articleRepository: Repository<ArticleDetail>,
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRepository(BbsUser)
        private readonly userRepository: Repository<BbsUser>,
    ) {}

    // getPostList
    async getPostList(data): Promise<any> {
        let res;
        let totalRes;
        const pageCount = data.pageCount ? data.pageCount * 1 : 10;
        const page = data.page ? data.page * 1 * pageCount : 0;
        const menuList = await this.menuRepository.find();
        if (data.articleType && data.articleType !== 'ALL' && data.articleType !== 'HOT') {
            totalRes = await this.indexRepository.find({ ARTICLE_TYPE: data.articleType, IS_DRAFTS: false });
            res = await this.indexRepository
              .createQueryBuilder('postList')
              .where('postList.ARTICLE_TYPE = :ARTICLE_TYPE', { ARTICLE_TYPE: data.articleType })
              .andWhere('postList.IS_DRAFTS = :IS_DRAFTS', { IS_DRAFTS: false })
              .orderBy({
                'postList.TOP': 'DESC',
                'postList.ID': 'DESC',
              })
              .skip(page)
              .take(pageCount)
              .getMany();
        } else {
            totalRes = await this.indexRepository.find({ IS_DRAFTS: false });
            if (data.articleType !== 'HOT') {
              res = await this.indexRepository
                .createQueryBuilder('postList')
                .where('postList.IS_DRAFTS = :IS_DRAFTS', { IS_DRAFTS: false })
                .orderBy({
                  'postList.TOP': 'DESC',
                  'postList.ID': 'DESC',
                })
                .skip(page)
                .take(pageCount)
                .getMany();
            } else {
              res = await this.indexRepository
                .createQueryBuilder('postList')
                .where('postList.IS_DRAFTS = :IS_DRAFTS', { IS_DRAFTS: false })
                .orderBy({
                  'postList.TOP': 'DESC',
                  'postList.ID': 'DESC',
                })
                .skip(page)
                .take(pageCount)
                .getMany();
            }
        }
        for (const item of res) {
          const user = await this.userRepository.findOne({ USER_ID: item.USER_ID });
          // item.articleContent = item.articleContent.substr(2).substring(0, item.articleContent.length - 4).replace('","', '\n');
          item.hearderIcon = user.HEADER_ICON ? user.HEADER_ICON : null;
          item.author = user.NICK_NAME;
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
        const res = await this.indexRepository.findOne({ ARTICLE_ID: data.articleId});
        const upRes = await this.articleRepository.findOne({ ARTICLE_ID: data.articleId });
        res.VIEW_COUNT += 1;
        upRes.VIEW_COUNT = res.VIEW_COUNT;
        await this.indexRepository.save(res);
        await this.articleRepository.save(upRes);
    }
}
