import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { User } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DownloadService],
  controllers: [DownloadController],
})
export class DownloadModule {}
