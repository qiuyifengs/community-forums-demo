import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectService } from './collect.service';
import { ReplyController } from './collect.controller';
import { MyCollectionList } from '../../entitys/myCollectionList.entity';
import { User } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MyCollectionList, User])],
  providers: [CollectService],
  controllers: [ReplyController],
})
export class CollectModule {}
