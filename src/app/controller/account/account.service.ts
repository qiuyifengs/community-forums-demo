import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entitys/user.entity';

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
  async changeUserInfo(data): Promise<any> {
    const res = await this.accountRepository.findOne({userId: data.userId});
    res.nickName = data.nickName ? data.nickName : res.userId;
    res.personalProfile = data.personalProfile ? data.personalProfile : res.personalProfile;
    // res.headerIcon = data.headerIcon;
    await this.accountRepository.save(res);
    return '修改成功！';
}
}
