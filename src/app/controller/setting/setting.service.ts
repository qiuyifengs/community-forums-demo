import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository, Code } from 'typeorm';
import { BbsUser } from '../../entitys/user.entity';
import { md5 } from '@/bing/common/encrypt';
import { Verification } from '../register/e-mail/send.e-mail';
// const jwt =  require ( 'jsonwebtoken');
import * as jwt from 'jsonwebtoken';
const config = require('../../../util/token.config');

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(BbsUser)
    private readonly settingRepository: Repository<BbsUser>,
  ) { }

  async getUserInfo(param): Promise<any> {
    console.log(await this.settingRepository.findOne({ USER_ID: param.userId }))
    return await this.settingRepository.findOne({ USER_ID: param.userId });

  }
  // resetPassword
  async resetPassword(param): Promise<any> {
      if (param.passWordOne !== param.passWordTwo) {
          return { message: '两次密码不一致！!'};
      }
      console.log(222,param);
      
      const res = await this.settingRepository.findOne({ USER_ID: param.userId });
      const msg = {
        code: 1,
        message: '',
        HttpStatus: 200,
        data: {},
      };
      if (!param.code && md5(param.oldPassword) !== res.PASSWORD) {
        msg.code = ApiErrorCode.USER_PASSWORD_ERROR;
        msg.HttpStatus = HttpStatus.BAD_REQUEST;
        msg.message = '输入的旧密码不正确！';
        return msg;
      } else {
        // do validate Code

      }
      const authToken = jwt.sign({ userId: param.userId, exp: (Date.now() / 1000) + (60 * 2) }, config.session.secrets);
      res.PASSWORD = md5(param.passWordOne);
      res.TOKEN = authToken;
      await this.settingRepository.save(res);
      const data = {
        token: authToken,
        code: ApiErrorCode.SUCCESS,
        message: '修改成功',
      };
      return data;
  }
  // reset email
  async resetEmail(param): Promise<any> {
    const res = await this.settingRepository.findOne({ USER_ID: param.userId });
    const msg = {
      code: 1,
      message: '',
      HttpStatus: 200,
      data: {},
    };
    if (param.oldEmail !== res.EMAIL) {
      msg.code = ApiErrorCode.USER_EMAIL_ERROR;
      msg.HttpStatus = HttpStatus.BAD_REQUEST;
      msg.message = '输入的旧邮箱不正确';
      return msg;
    }
    res.EMAIL = param.newEmail;
    await this.settingRepository.save(res);
    const data = {
      code: ApiErrorCode.SUCCESS,
      message: '修改成功',
    };
    return data;
  }
  // validate email
  async validateEmail(param): Promise<any> {
    let email;
    const res = await this.settingRepository.findOne({ EMAIL: param.email });
    const msg = {
      code: 1,
      message: '',
      HttpStatus: 200,
      data: {},
    };
    if (!param.email || param.email === '') {
      email = res.EMAIL;
    } else {
      if (param.email !== res.EMAIL) {
        msg.code = ApiErrorCode.USER_EMAIL_ERROR;
        msg.HttpStatus = HttpStatus.BAD_REQUEST;
        msg.message = '与绑定的邮箱不一致！';
        return msg;
      }
      email = param.email;
    }
    const Etoken = jwt.sign({
      userId: param.userId,
    }, config.session.secrets, {
        expiresIn: '2h',
      });
    Verification.verifica(param.type, param.userId, email, Etoken);
    return { code: ApiErrorCode.SUCCESS, message: '已发至所绑定邮箱，请前往验证！' };
  }
}
