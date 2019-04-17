
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import{LoginService}from '../login/login.service'
import { AuthService } from './auth.service'
import { User} from '../../entitys/user.entity'
import { JwtStrategy } from './jwt.strategy'
import { from } from 'rxjs';


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthService, JwtStrategy,LoginService],

})
export class AuthModule {

}
