import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { User } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UpdateService],
  controllers: [UpdateController],
})
export class UpdateModule {}
