import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchPageService } from './searchPage.service';
import { SearchPageController } from './searchPage.controller';
import { PostList } from '../../entitys/postList.entity';
import { User } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostList, User])],
  providers: [SearchPageService],
  controllers: [SearchPageController],
})
export class SearchPageModule {}
