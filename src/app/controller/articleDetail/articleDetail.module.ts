import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleDetailService } from './articleDetail.service';
import { ArticleDetailController } from './articleDetail.controller';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { MyCollectionList } from '../../entitys/myCollectionList.entity';
import { BbsCommentsList } from '../../entitys/commentList.entity';
import { BbsChildrenComments } from '../../entitys/childrenComment.entity';
import { PostList } from '../../entitys/postList.entity';
import { BbsUser } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleDetail, MyCollectionList, BbsCommentsList, BbsChildrenComments, PostList, BbsUser])],
  providers: [ArticleDetailService],
  controllers: [ArticleDetailController],
})
export class ArticleDetailModule {}
