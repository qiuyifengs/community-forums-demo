import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { LoginService } from '../login.service';
import { JwtPayload } from './jwt-payload.interface';

import { Repository } from 'typeorm';
import { User } from '../../../entitys/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    user: User;
    constructor(
        @InjectRepository(User)
      //  private readonly UserRepository: Repository<User>,
        private readonly loginService: LoginService,
      //  private readonly jwtService: JwtService,
        ) { }

    async createToken(): Promise<any> {
        const userName = 'wuzhanfly@163.com'
        console.log(11111111111111111);
        
        const user: JwtPayload = { userId: userName };
        return jwt.sign(user, '123', { expiresIn: 30 });
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        console.log(2222222222222222222222);
        
        return this.loginService.findbyUserId(payload.userId);
    }

}
