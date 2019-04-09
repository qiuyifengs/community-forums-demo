import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { Forum } from '../../entitys/forum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forum])],
  providers: [ForumService],
  controllers: [ForumController],
})
export class ForumModule {}
