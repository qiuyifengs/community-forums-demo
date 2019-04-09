import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { Menu } from '../../entitys/menuList.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PostList, ArticleDetail, Menu])],
  providers: [IndexService],
  controllers: [IndexController],
})
export class IndexModule {}
