import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { User } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
