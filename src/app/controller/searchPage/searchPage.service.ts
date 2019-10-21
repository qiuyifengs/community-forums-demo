import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsUser } from '../../entitys/user.entity';
import { util } from '../../../bing';

@Injectable()
export class SearchPageService {
    constructor(
        @InjectRepository(BbsPostList)
        private readonly postListRepository: Repository<BbsPostList>,
        @InjectRepository(BbsUser)
        private readonly userRepository: Repository<BbsUser>,
    ) {}

    // searche article
    async searchArticle(param): Promise<any> {
        let res;
        let totalRes;
        const pageCount = param.pageCount ? param.pageCount * 1 : 10;
        const page = param.page ? param.page * 1 * pageCount : 0;
        totalRes = await this.postListRepository
                    .createQueryBuilder('posts')
                    .where('posts.AUTHOR LIKE :param')
                    .orWhere('posts.ARTICLE_TITLE LIKE :param')
                    .andWhere('posts.IS_DRAFTS = :IS_DRAFTS', { IS_DRAFTS: false })
                    .setParameters({
                        param: '%' + param.keyword + '%',
                    })
                    .getMany();
        res = await this.postListRepository
                    .createQueryBuilder('posts')
                    .where('posts.AUTHOR LIKE :param')
                    .orWhere('posts.ARTICLE_TITLE LIKE :param')
                    .andWhere('posts.IS_DRAFTS = :IS_DRAFTS', { IS_DRAFTS: false })
                    .setParameters({
                        param: '%' + param.keyword + '%',
                    })
                    .skip(page)
                    .take(pageCount)
                    .getMany();

        if (res.length > 0) {
            for (const item of res) {
                const user = await this.userRepository.findOne({ USER_ID: item.USER_ID });
                // item.articleContent = item.articleContent.substr(2).substring(0, item.articleContent.length - 4).replace('","', '\n');
                item.hearderIcon = user.HEADER_ICON;
                item.author = user.NICK_NAME;
            }
        }
        const msg = {
            code: 1,
            message: '',
            HttpStatus: 200,
            total: 0,
            data: {},
        };
        msg.HttpStatus = HttpStatus.BAD_REQUEST;
        if (res) {
            msg.code = ApiErrorCode.SUCCESS;
            msg.message = '查询成功！';
            msg.data = res;
            msg.total = totalRes.length;
            return msg;
        }  else {
            msg.code = ApiErrorCode.NO_DATA;
            msg.message = '查无数据！';
            return msg;
        }
    }
}
