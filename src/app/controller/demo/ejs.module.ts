import { Module } from '@nestjs/common';
import { DposController } from './ejs.controller';
import { EJSService } from './ejs.service';

@Module({
  imports: [],
  controllers: [DposController],
  providers: [EJSService],
})

export class EJSModule {}
