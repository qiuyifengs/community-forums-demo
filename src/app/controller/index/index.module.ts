import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsArticleDetail } from '../../entitys/articleDetail.entity';
import { BbsMenu } from '../../entitys/menuList.entity';
import { BbsUser } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BbsPostList, BbsArticleDetail, BbsMenu, BbsUser])],
  providers: [IndexService],
  controllers: [IndexController],
})
export class IndexModule {}
