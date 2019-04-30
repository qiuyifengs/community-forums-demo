import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchPageService } from './searchPage.service';
import { SearchPageController } from './searchPage.controller';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsUser } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BbsPostList, BbsUser])],
  providers: [SearchPageService],
  controllers: [SearchPageController],
})
export class SearchPageModule {}
