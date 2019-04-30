import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { BbsUser } from '../../entitys/user.entity';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsArticleDetail } from '../../entitys/articleDetail.entity';
import { BbsCommentsList } from '../../entitys/commentList.entity';
import { BbsChildrenComments } from '../../entitys/childrenComment.entity';
import { BbsMyCollectionList } from '../../entitys/myCollectionList.entity';
import * as fs from 'fs';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(BbsUser)
    private readonly accountRepository: Repository<BbsUser>,
    @InjectRepository(BbsPostList)
    private readonly postRepository: Repository<BbsPostList>,
    @InjectRepository(BbsArticleDetail)
    private readonly articleRepository: Repository<BbsArticleDetail>,
    @InjectRepository(BbsCommentsList)
    private readonly commentRepository: Repository<BbsCommentsList>,
    @InjectRepository(BbsChildrenComments)
    private readonly childCommentRepository: Repository<BbsChildrenComments>,
    @InjectRepository(BbsMyCollectionList)
    private readonly collectRepository: Repository<BbsMyCollectionList>,
  ) {}
  async getUserInfo(param): Promise<any> {
    return await this.accountRepository.findOne({ NICK_NAME: param.nickName });

  }
  // change user INFO
  async changeUserInfo(param): Promise<any> {
    const msg = {
      code: 200,
      message: '',
    };
    const hadNickName = await this.accountRepository.findOne({NICK_NAME: param.nickName});
    if (hadNickName && hadNickName.USER_ID !== param.userId) {
      msg.code = ApiErrorCode.CHANGE_USERINFO_FERROR;
      msg.message = '昵称已被占用，请换另一个！';
      return msg;
    }
    const res = await this.accountRepository.findOne({USER_ID: param.userId});
    if (res) {
      res.NICK_NAME = param.nickName ? param.nickName : res.NICK_NAME;
      res.PERSONAL_PROFILE = param.personalProfile ? param.personalProfile : res.PERSONAL_PROFILE;
      if (param.headerIcon) {
        if (res.HEADER_ICON) {
          fs.unlinkSync(`./src/libs/${res.HEADER_ICON}`);
        }
        res.HEADER_ICON = param.headerIcon.replace('src/libs/', '');
      }
      // update dataBase
      await this.accountRepository.save(res);
      await this.postRepository // post db
      .createQueryBuilder()
      .update()
      .set({AUTHOR: res.NICK_NAME})
      .where('userId = :userId', {userId: res.USER_ID})
      .execute();

      await this.articleRepository // articleDetail db
      .createQueryBuilder()
      .update()
      .set({AUTHOR: res.NICK_NAME})
      .where('userId = :userId', {userId: res.USER_ID})
      .execute();

      await this.commentRepository // comment db --- commentatorName
      .createQueryBuilder()
      .update()
      .set({COMMENTATOR_NAME: res.NICK_NAME})
      .where('commentatorId = :commentatorId', {commentatorId: res.USER_ID})
      .execute();

      await this.commentRepository // comment db --- commentUserName
      .createQueryBuilder()
      .update()
      .set({COMMENTATOR_NAME: res.NICK_NAME})
      .where('userId = :userId', {userId: res.USER_ID})
      .execute();

      await this.childCommentRepository // childComment db --- commentatorName
      .createQueryBuilder()
      .update()
      .set({
        COMMENTATOR_NAME: res.NICK_NAME,
      })
      .where('commentatorId = :commentatorId', {commentatorId: res.USER_ID})
      .execute();

      await this.childCommentRepository // childComment db --- commentUserName
      .createQueryBuilder()
      .update()
      .set({COMMENTATOR_NAME: res.NICK_NAME})
      .where('userId = :userId', {userId: res.USER_ID})
      .execute();

      await this.childCommentRepository // childComment db --- author
      .createQueryBuilder()
      .update()
      .set({AUTHOR: res.NICK_NAME})
      .where('authorId = :authorId', {authorId: res.USER_ID})
      .execute();

      await this.collectRepository // collect db
      .createQueryBuilder()
      .update()
      .set({AUTHOR: res.NICK_NAME})
      .where('authorId = :authorId', {authorId: res.USER_ID})
      .execute();

      msg.code = ApiErrorCode.SUCCESS;
      msg.message = '修改成功！';
    } else {
      msg.code = ApiErrorCode.CHANGE_USERINFO_FERROR;
      msg.message = '修改失败！';
    }
    return msg;
}
}
