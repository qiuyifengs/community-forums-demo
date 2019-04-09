import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stratagy';
import { LoginModule } from '../login.module';
import { from } from 'rxjs';

@Module({
    imports: [LoginModule],
    providers: [AuthService, JwtStrategy],

})
export class AuthModule { }
