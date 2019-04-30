
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {LoginService} from '../login/login.service';
import { AuthService } from './auth.service';
import { BbsUser} from '../../entitys/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { from } from 'rxjs';

@Module({
    imports: [TypeOrmModule.forFeature([BbsUser])],
    providers: [AuthService, JwtStrategy, LoginService],

})
export class AuthModule {

}
