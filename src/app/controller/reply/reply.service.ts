import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ApiException } from '../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { BbsCommentsList } from '../../entitys/commentList.entity';
import { BbsChildrenComments } from '../../entitys/childrenComment.entity';
import { BbsUser } from '../../entitys/user.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(BbsCommentsList)
    private readonly commentRepository: Repository<BbsCommentsList>,
    @InjectRepository(BbsChildrenComments)
    private readonly childrenCommentRepository: Repository<BbsChildrenComments>,
    @InjectRepository(BbsUser)
    private readonly userCommentRepository: Repository<BbsUser>,
  ) {}
  // get comment li(st
  async getComments(param): Promise<any> {
    let commentRes;
    const pageCount = param.pageCount ? param.pageCount * 1 : 5;
    const page = param.page ? (param.page - 1) * 1 * pageCount : 0;
    const user = await this.userCommentRepository.findOne({NICK_NAME: param.nickName});
    user.HAD_NEWS = false;
    this.userCommentRepository.save(user);
    const totalRes = await this.commentRepository.find({COMMENTATOR_ID: user.USER_ID});
    commentRes = await this.commentRepository
                .createQueryBuilder('commentleList')
                .where('commentleList.COMMENTATOR_ID = :COMMENTATOR_ID', { COMMENTATOR_ID: user.USER_ID })
                .orWhere('commentleList.COMMENTATOR_NAME= :COMMENTATOR_NAME', {COMMENTATOR_NAME: param.nickName})
                .orderBy('commentleList.ID', 'DESC')
                .skip(page)
                .take(pageCount)
                .getMany();
    for (const item of commentRes) {
      const filterMyAnswer = [];
      const commentUserInfo = await this.userCommentRepository.findOne({USER_ID: item.USER_ID});
      item.hearderIcon = commentUserInfo.HEADER_ICON;
      const childrenComRes =  await this.childrenCommentRepository
                              .createQueryBuilder('childCommentList')
                              .where('childCommentList.ARTICLE_ID = :ARTICLE_ID', { ARTICLE_ID: item.articleId })
                              .andWhere('childCommentList.COMMENT_ID = :COMMENT_ID', {COMMENT_ID: item.commentId})
                              .getMany();
      childrenComRes.forEach((chilItem, chilInd) => {
        if (chilItem.USER_ID !== user.USER_ID) {
          filterMyAnswer.push(chilItem);
        }
      });
      item.childrenComentList = filterMyAnswer;
    }
    const resData = {
      code: ApiErrorCode.SUCCESS,
      commentRes,
      total: totalRes.length,
    };
    return resData;
    // return commentRes;
  }
}
