import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { CommentsList } from '../../entitys/commentList.entity';
import { ChildrenComments } from '../../entitys/childrenComment.entity';
import { BbsUser } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsList, ChildrenComments, BbsUser])],
  providers: [ReplyService],
  controllers: [ReplyController],
})
export class ReplyModule {}
