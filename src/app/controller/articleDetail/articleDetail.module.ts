import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleDetailService } from './articleDetail.service';
import { ArticleDetailController } from './articleDetail.controller';
import { BbsArticleDetail } from '../../entitys/articleDetail.entity';
import { BbsMyCollectionList } from '../../entitys/myCollectionList.entity';
import { BbsCommentsList } from '../../entitys/commentList.entity';
import { BbsChildrenComments } from '../../entitys/childrenComment.entity';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsUser } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BbsArticleDetail, BbsMyCollectionList, BbsCommentsList, BbsChildrenComments, BbsPostList, BbsUser])],
  providers: [ArticleDetailService],
  controllers: [ArticleDetailController],
})
export class ArticleDetailModule {}
