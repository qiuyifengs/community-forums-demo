import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectService } from './collect.service';
import { ReplyController } from './collect.controller';
import { BbsMyCollectionList } from '../../entitys/myCollectionList.entity';
import { BbsUser } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BbsMyCollectionList, BbsUser])],
  providers: [CollectService],
  controllers: [ReplyController],
})
export class CollectModule {}
