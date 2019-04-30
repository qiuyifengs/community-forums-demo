import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { BbsUser } from '../../entitys/user.entity';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsArticleDetail } from '../../entitys/articleDetail.entity';
import { BbsCommentsList } from '../../entitys/commentList.entity';
import { BbsChildrenComments } from '../../entitys/childrenComment.entity';
import { BbsMyCollectionList } from '../../entitys/myCollectionList.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BbsUser, BbsPostList, BbsArticleDetail, BbsCommentsList, BbsChildrenComments, BbsMyCollectionList])],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
