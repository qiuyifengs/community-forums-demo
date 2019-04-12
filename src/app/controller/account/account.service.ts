import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    res.nickName = param.nickName ? param.nickName : res.nickName;
    res.personalProfile = param.personalProfile ? param.personalProfile : res.personalProfile;
    if (param.headerIcon) {
      if (res.headerIcon) {
        fs.unlinkSync(`./${res.headerIcon}`);
      }
      res.headerIcon = param.headerIcon;
    }
    await this.accountRepository.save(res);
    const msg = {
      code: 200,
      message: '修改成功！',
    };
    return msg;
}
}
