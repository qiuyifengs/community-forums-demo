import { Injectable, HttpStatus, Next } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { JwtPayload } from '../auth/jwt-payload.interface';
import * as curUserId from '../../global';
import { Repository } from 'typeorm';
import { BbsUser } from '../../entitys/user.entity';
import { md5 } from '../../../bing/common/encrypt';
import { Verification } from '../register/e-mail/send.e-mail';
import * as jwt from 'jsonwebtoken';
import { from } from 'rxjs';
import { util } from '../../../bing';

@Injectable()
export class LoginService {
  user: BbsUser;
  constructor(

    @InjectRepository(BbsUser)
    private readonly signRepository: Repository<BbsUser>,
  ) { }
  // createToken
  public async createToken(userId: any): Promise<any> {
    const user: JwtPayload = {userId};

    return jwt.sign({
      user,
    }, util.session.secrets
      , {
        expiresIn: '3600s',
      });
  }

  // login
  async login(data): Promise<any> {

    const user: JwtPayload = { userId: data.userId };
    const res = await this.signRepository.findOne({ USER_ID: data.userId });
    const msg = {
      code: 1,
      message: '',
      HttpStatus: 200,
      data: {},

    };
    if (res) {
      if (md5(data.passWord) === res.PASSWORD) {
        // 登入成功返回ｔｏｋｅｎ
        const token = await this.createToken(data.userId);
        console.log(token);
        msg.code = ApiErrorCode.USER_LOGIN_SUCCESS;
        msg.message = '登入成功';
        const data1 = {
          userId: res.USER_ID,
          nickName: res.NICK_NAME,
          token,
        };
        msg.data = data1;
        console.log(111, msg);
        return msg;

      }
      if (md5(data.passWord) !== res.PASSWORD) {
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
    const date = await this.signRepository.findOne({ USER_ID: param.userId });
    if (date) {
      const result = await Verification.Everifica(param.userId, param);
      console.log(result.code);

      if (result.code === 10008) {
        date.ACTIVITY = true;
        await this.signRepository.save(date);
      }
      return result;
    } else {
      console.log('邮箱验证：', param);
      return { message: '用有误' };
    }

  }

}
