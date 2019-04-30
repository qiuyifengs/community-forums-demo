import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ApiException } from '../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { CommentsList } from '../../entitys/commentList.entity';
import { ChildrenComments } from '../../entitys/childrenComment.entity';
import { BbsUser } from '../../entitys/user.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(CommentsList)
    private readonly commentRepository: Repository<CommentsList>,
    @InjectRepository(ChildrenComments)
    private readonly childrenCommentRepository: Repository<ChildrenComments>,
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
    const totalRes = await this.commentRepository.find({commentatorId: user.USER_ID});
    commentRes = await this.commentRepository
                .createQueryBuilder('commentleList')
                .where('commentleList.commentatorId = :commentatorId', { commentatorId: user.USER_ID })
                .orWhere('commentleList.commentatorName= :commentatorName', {commentatorName: param.nickName})
                .orderBy('commentleList.serialNum', 'DESC')
                .skip(page)
                .take(pageCount)
                .getMany();
    for (const item of commentRes) {
      const filterMyAnswer = [];
      const commentUserInfo = await this.userCommentRepository.findOne({USER_ID: item.userId});
      item.hearderIcon = commentUserInfo.HEADER_ICON;
      const childrenComRes =  await this.childrenCommentRepository
                              .createQueryBuilder('childCommentList')
                              .where('childCommentList.articleId = :articleId', { articleId: item.articleId })
                              .andWhere('childCommentList.commentId = :commentId', {commentId: item.commentId})
                              .getMany();
      childrenComRes.forEach((chilItem, chilInd) => {
        if (chilItem.userId !== user.USER_ID) {
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
