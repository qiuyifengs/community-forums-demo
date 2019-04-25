import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { User } from '../../entitys/user.entity';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { CommentsList } from '../../entitys/commentList.entity';
import { ChildrenComments } from '../../entitys/childrenComment.entity';
import { MyCollectionList } from '../../entitys/myCollectionList.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PostList, ArticleDetail, CommentsList, ChildrenComments, MyCollectionList])],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
