import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { User } from '../../entitys/user.entity';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { CommentsList } from '../../entitys/commentList.entity';
import { ChildrenComments } from '../../entitys/childrenComment.entity';
import { MyCollectionList } from '../../entitys/myCollectionList.entity';
import * as fs from 'fs';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly accountRepository: Repository<User>,
    @InjectRepository(PostList)
    private readonly postRepository: Repository<PostList>,
    @InjectRepository(ArticleDetail)
    private readonly articleRepository: Repository<ArticleDetail>,
    @InjectRepository(CommentsList)
    private readonly commentRepository: Repository<CommentsList>,
    @InjectRepository(ChildrenComments)
    private readonly childCommentRepository: Repository<ChildrenComments>,
    @InjectRepository(MyCollectionList)
    private readonly collectRepository: Repository<MyCollectionList>,
  ) {}
  async getUserInfo(param): Promise<any> {
    return await this.accountRepository.findOne({ nickName: param.nickName });

  }
  // change user INFO
  async changeUserInfo(param): Promise<any> {
    const msg = {
      code: 200,
      message: '',
    };
    const hadNickName = await this.accountRepository.findOne({nickName: param.nickName});
    if (hadNickName && hadNickName.userId !== param.userId) {
      msg.code = ApiErrorCode.CHANGE_USERINFO_FERROR;
      msg.message = '昵称已被占用，请换另一个！';
      return msg;
    }
    const res = await this.accountRepository.findOne({userId: param.userId});
    if (res) {
      res.nickName = param.nickName ? param.nickName : res.nickName;
      res.personalProfile = param.personalProfile ? param.personalProfile : res.personalProfile;
      if (param.headerIcon) {
        if (res.headerIcon) {
          fs.unlinkSync(`./src/libs/${res.headerIcon}`);
        }
        res.headerIcon = param.headerIcon.replace('src/libs/', '');
      }
      // update dataBase
      await this.accountRepository.save(res);
      await this.postRepository // post db
      .createQueryBuilder()
      .update()
      .set({author: res.nickName})
      .where('userId = :userId', {userId: res.userId})
      .execute();

      await this.articleRepository // articleDetail db
      .createQueryBuilder()
      .update()
      .set({author: res.nickName})
      .where('userId = :userId', {userId: res.userId})
      .execute();

      await this.commentRepository // comment db --- commentatorName
      .createQueryBuilder()
      .update()
      .set({commentatorName: res.nickName})
      .where('commentatorId = :commentatorId', {commentatorId: res.userId})
      .execute();

      await this.commentRepository // comment db --- commentUserName
      .createQueryBuilder()
      .update()
      .set({commentUserName: res.nickName})
      .where('userId = :userId', {userId: res.userId})
      .execute();

      await this.childCommentRepository // childComment db --- commentatorName
      .createQueryBuilder()
      .update()
      .set({
        commentatorName: res.nickName,
      })
      .where('commentatorId = :commentatorId', {commentatorId: res.userId})
      .execute();

      await this.childCommentRepository // childComment db --- commentUserName
      .createQueryBuilder()
      .update()
      .set({commentUserName: res.nickName})
      .where('userId = :userId', {userId: res.userId})
      .execute();

      await this.childCommentRepository // childComment db --- author
      .createQueryBuilder()
      .update()
      .set({author: res.nickName})
      .where('authorId = :authorId', {authorId: res.userId})
      .execute();

      await this.collectRepository // collect db
      .createQueryBuilder()
      .update()
      .set({author: res.nickName})
      .where('authorId = :authorId', {authorId: res.userId})
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
