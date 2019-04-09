import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusService } from './focus.service';
import { FocusController } from './focus.controller';
import { Focus } from '../../entitys/focus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Focus])],
  providers: [FocusService],
  controllers: [FocusController],
})
export class FocusModule {}
