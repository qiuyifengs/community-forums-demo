import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { User } from '../../entitys/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RegisterService],
  controllers: [RegisterController],
})
export class RegisterModule {}
