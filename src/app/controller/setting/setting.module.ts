import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { User } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
