import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { BbsUser } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BbsUser])],
  providers: [UpdateService],
  controllers: [UpdateController],
})
export class UpdateModule {}
