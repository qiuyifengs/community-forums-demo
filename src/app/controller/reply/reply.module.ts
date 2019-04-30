import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { BbsCommentsList } from '../../entitys/commentList.entity';
import { BbsChildrenComments } from '../../entitys/childrenComment.entity';
import { BbsUser } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BbsCommentsList, BbsChildrenComments, BbsUser])],
  providers: [ReplyService],
  controllers: [ReplyController],
})
export class ReplyModule {}
