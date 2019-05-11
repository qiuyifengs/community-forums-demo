import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository, getConnection } from 'typeorm';
import { BbsUser } from '../../entitys/user.entity';
import { md5 } from '../../../bing/common/encrypt';
import { configure } from 'log4js';
import { Verification } from './e-mail/send.e-mail';
// const jwt = require('jsonwebtoken');
import * as jwt from 'jsonwebtoken';
import { util } from '../../../bing';

@Injectable()
export class RegisterService {
    constructor(
        @InjectRepository(BbsUser)
        private readonly registerRepository: Repository<BbsUser>,
    ) { }

    // Register
    async register(param): Promise<any> {
        if (param.passWordOne !== param.passWordTwo) {
            return '两次密码不一致！';
        }
        const paramObj = {
            USER_ID: '',
            PASSWORD: '',
            NICK_NAME: '',
            CREATED: '',
            TOKEN: '',
            EMAIL: '',
        };
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const date = new Date().getTime();
            const res = await this.registerRepository.findOne({ USER_ID: param.userId });
            const resNickName = await this.registerRepository.findOne({ NICK_NAME: param.nickName });
            const msg = {
                code: 0,
                message: '',
                data: {},
            };
            if (resNickName) {
                msg.code = ApiErrorCode.USER_NAME_HAD;
                msg.message = '该昵称已占用！';
                return msg;
            }
            if (res) {
                msg.code = ApiErrorCode.USER_NAME_HAD;
                msg.message = '该邮箱已被注册！';
                // msg.data = res;
                return msg;
            }
            paramObj.PASSWORD = md5(param.passWordOne);
            paramObj.NICK_NAME = param.nickName;
            // e-mail token
            const Etoken = jwt.sign({
                userId: param.userId,
            }, util.session.secrets, {
                expiresIn: '10min',
            });
            // login token
            const token = jwt.sign({
                userId: param.userId,
            }, util.session.secrets, {
                expiresIn: '3d',
            });
            paramObj.USER_ID = param.userId;
            paramObj.CREATED = date + '';
            paramObj.TOKEN = token;
            paramObj.EMAIL = param.userId;
            await this.registerRepository.save(paramObj);
            msg.code = ApiErrorCode.USER_REGISTER_SUCCESS;
            msg.message = '注册成功';

            const data = {
                userId: param.userId,
                nickName: param.nickName,
                token,
            };
            msg.data = data;
            Verification.verifica(1, param.userId, param.email, Etoken);
            // commit transaction now:
            await queryRunner.commitTransaction();
            return msg;
        } catch (err) {
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }
}
