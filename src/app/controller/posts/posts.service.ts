import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository, getConnection } from 'typeorm';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsArticleDetail } from '../../entitys/articleDetail.entity';
import { BbsUser } from '../../entitys/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(BbsPostList)
    private readonly postsRepository: Repository<BbsPostList>,
    @InjectRepository(BbsArticleDetail)
    private readonly articleRepository: Repository<BbsArticleDetail>,
    @InjectRepository(BbsUser)
    private readonly usereRepository: Repository<BbsUser>,
  ) {}

  // myArticleList
  async myArticleList(data): Promise<any> {
    let res;
    let totalRes;
    const pageCount = data.pageCount ? data.pageCount * 1 : 10;
    const page = data.page ? (data.page - 1) * 1 * pageCount : 0;
    const user = await this.usereRepository.findOne({ NICK_NAME: data.nickName });
    totalRes = await this.postsRepository.find({USER_ID: user.USER_ID});
    res = await this.postsRepository
          .createQueryBuilder('articleList')
          .where('articleList.USER_ID = :USER_ID', { USER_ID: user.USER_ID })
          .orderBy('articleList.ID', 'DESC')
          .skip(page)
          .take(pageCount)
          .getMany();
    // res.forEach((item, ind) => {
    //     // res[ind].articleContent = item.articleContent.substr(2).substring(0, item.articleContent.length - 4).replace('","', '\n');
    // });
    console.log(111, res)
    const articleData = {
        articleList: res,
        total: totalRes.length,
    };
    return articleData;
  }

  // deleteArticle
  async deleteArticle(data): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const res =  await this.postsRepository.find({ARTICLE_ID: data.articleId});
        const result = await this.postsRepository.remove(res);
        if (result.length > 0) {
          const articlkeRes =  await this.articleRepository.find({ARTICLE_ID: data.articleId});
          await this.articleRepository.remove(articlkeRes);
          await queryRunner.commitTransaction();
          return {message: '删除成功！'};
        } else {
          const msg = {
            code: ApiErrorCode.REMOVE_FAILT,
            HttpStatus: HttpStatus.BAD_REQUEST,
            message: '删除失败',
          };
          await queryRunner.commitTransaction();
          return msg;
        }
    } catch (err) {
        await queryRunner.rollbackTransaction();
    } finally {
        await queryRunner.release();
    }
  }
}
