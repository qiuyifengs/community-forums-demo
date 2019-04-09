import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleDetailService } from './articleDetail.service';
import { ArticleDetailController } from './articleDetail.controller';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { MyCollectionList } from '../../entitys/myCollectionList.entity';
import { CommentsList } from '../../entitys/commentList.entity';
import { ChildrenComments } from '../../entitys/childrenComment.entity';
import { PostList } from '../../entitys/postList.entity';
import { User } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleDetail, MyCollectionList, CommentsList, ChildrenComments, PostList, User])],
  providers: [ArticleDetailService],
  controllers: [ArticleDetailController],
})
export class ArticleDetailModule {}
