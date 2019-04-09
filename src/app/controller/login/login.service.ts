import { Injectable, HttpStatus, Next } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { JwtPayload } from './auth/jwt-payload.interface';
import { Repository } from 'typeorm';
import {AuthService} from './auth/auth.service'
import { User } from '../../entitys/user.entity';
import { md5 } from '@/bing/common/encrypt';
import { Verification } from '../register/e-mail/send.e-mail';
import * as jwt from 'jsonwebtoken';
import { from } from 'rxjs';
const config = require('../../../util/token.config');

@Injectable()
export class LoginService {
  user: User;
  constructor(

    @InjectRepository(User)
    private readonly signRepository: Repository<User>,
  ) { }
  // createToken
  async createToken(userId: string): Promise<any> {
    const user: JwtPayload = { userId};

    return jwt.sign({
      user,
    }, config.session.secrets
      , {
        expiresIn: '36',
      });
  }
  // validateUser
  public async findbyUserId(userId: string): Promise<any> {
    return this.signRepository.findOne({ userId });
  }

  getUser(): User {
    return this.user;
  }
  // login
  async login(data): Promise<any> {

    const user: JwtPayload = { userId: data.userId };

    const res = await this.signRepository.findOne({ userId: data.userId });
    const msg = {
      code: 1,
      message: '',
      HttpStatus: 200,
      data: {},

    };
    if (res) {
      if (md5(data.passWord) === res.passWord) {
        // 登入成功返回ｔｏｋｅｎ
        const token = await this.createToken(res.userId);
        console.log(token);
        msg.code = ApiErrorCode.USER_LOGIN_SUCCESS;
        msg.message = '登入成功';
        const data1 = {
          userId: res.userId,
          nickName: res.nickName,
          token,
        };
        msg.data = data1;
        console.log(111, msg);
        return msg;

      }
      if (md5(data.passWord) !== res.passWord) {
        msg.code = ApiErrorCode.USER_PASSWORD_ERROR;
        msg.HttpStatus = HttpStatus.BAD_REQUEST;
        msg.message = '用户密码不正确！';

        return msg;

      }
    } else {
      msg.code = ApiErrorCode.USER_ID_INVALID;
      msg.HttpStatus = HttpStatus.BAD_REQUEST;
      msg.message = '用户不存在，请注册！';
      return msg;

    }

  }

  async Emailverifica(param): Promise<any> {
    const user: JwtPayload = { userId: param.userId };
    const date = await this.signRepository.findOne({ userId: user.userId });
    if (date) {
      const result = await Verification.Everifica(user.userId, param);
      console.log(result.code);

      if (result.code === 10008) {
        date.activity = true;
        await this.signRepository.save(date);
      }
      return result;
    } else {
      console.log('邮箱验证：', param);
      return { message: '用有误' };
    }

  }

}
