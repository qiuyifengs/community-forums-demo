import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { User } from '../../entitys/user.entity';
import * as fs from 'fs';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly accountRepository: Repository<User>,
  ) {}
  async getUserInfo(param): Promise<any> {
    return await this.accountRepository.findOne({ userId: param.userId });

  }
  // change user INFO
  async changeUserInfo(param): Promise<any> {
    const res = await this.accountRepository.findOne({userId: param.userId});
    const msg = {
      code: 200,
      message: '',
    };
    if (res) {
      res.nickName = param.nickName ? param.nickName : res.nickName;
      res.personalProfile = param.personalProfile ? param.personalProfile : res.personalProfile;
      if (param.headerIcon) {
        if (res.headerIcon) {
          fs.unlinkSync(`./src/libs/${res.headerIcon}`);
        }
        res.headerIcon = param.headerIcon.replace('src/libs/', '');
      }
      await this.accountRepository.save(res);
      msg.code = ApiErrorCode.SUCCESS;
      msg.message = '修改成功！';
    } else {
      msg.code = ApiErrorCode.CHANGE_USERINFO_FERROR;
      msg.message = '修改失败！';
    }
    return msg;
}
}
