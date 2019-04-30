import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { Menu } from '../../entitys/menuList.entity';
import { BbsUser } from '../../entitys/user.entity';
import { LabelType } from '../../entitys/labelType.entity';
import { BbsLabelList } from '../../entitys/labelList.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostList, ArticleDetail, Menu, BbsUser, LabelType, BbsLabelList])],
  providers: [PublishService],
  controllers: [PublishController],
})
export class PublishModule {}
