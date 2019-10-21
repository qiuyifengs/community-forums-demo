import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsArticleDetail } from '../../entitys/articleDetail.entity';
import { BbsMenu } from '../../entitys/menuList.entity';
import { BbsUser } from '../../entitys/user.entity';
import { BbsLabelType } from '../../entitys/labelType.entity';
import { BbsLabelList } from '../../entitys/labelList.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BbsPostList, BbsArticleDetail, BbsMenu, BbsUser, BbsLabelType, BbsLabelList])],
  providers: [PublishService],
  controllers: [PublishController],
})
export class PublishModule {}
