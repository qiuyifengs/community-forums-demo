import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostList, ArticleDetail])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
