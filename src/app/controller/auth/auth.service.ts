import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import * as curUserId from '../../global';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginService } from '../login/login.service';
import { User } from '../../entitys/user.entity';

@Injectable()

export class AuthService {
    user: User;
    constructor(
        @InjectRepository(User)
        private readonly authRepository: Repository<User>,
      ) { }

    public async validate(payload): Promise<boolean> {
        const user = await this.authRepository.findOne({userId: payload});
        // 有該筆資料，回傳true
        if (user) {
            return true;
        } else {
            return false;
        }
    }

}
