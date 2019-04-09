import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { PostList } from '../../entitys/postList.entity';
import { util } from '../../../bing';

@Injectable()
export class SearchPageService {
    constructor(
        @InjectRepository(PostList)
        private readonly postListRepository: Repository<PostList>,
    ) {}

    // searche article
    async searchArticle(param): Promise<any> {
        const res = await this.postListRepository
                    .createQueryBuilder('posts')
                    .where('posts.author LIKE :param')
                    .orWhere('posts.articleTitle LIKE :param')
                    .setParameters({
                        param: '%' + param.keyword + '%',
                    })
                    .getMany();
        res.forEach((item, ind) => {
            res[ind].articleContent = item.articleContent.substr(2).substring(0, item.articleContent.length - 4).replace('","', '\n');
            });
        const msg = {
            code: 1,
            message: '',
            HttpStatus: 200,
            total: 0,
            data: {},
        };
        msg.HttpStatus = HttpStatus.BAD_REQUEST;
        if (res) {
            msg.message = '查询成功！';
            msg.data = res;
            msg.total = res.length;
            return msg;
        }  else {
            msg.code = ApiErrorCode.NO_DATA;
            msg.message = '查无数据！';
            return msg;
        }
    }
}
