const _ = require('lodash');
const nodemailer = require('nodemailer');
import * as jwt from 'jsonwebtoken';
const moment = require('moment');
const conf = require('../../../../util/token.config');
import { ApiException } from '../../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../..//../../bing/common/enums/api-error-code.enum';
import { HttpStatus } from '@nestjs/common';

const config = {
    host: 'smtp.163.com',
    port: 25,
    auth: {
        user: 'wuzhanfly@163.com',
        pass: 'wzf48690812',
    },
};
const transporter = nodemailer.createTransport(config);
const name = 'Ghost';
const host = 'http://192.168.4.188:3002';

// E-mail verification
export class Verification {
    static async verifica(type, userId, email, token): Promise<any> {
        const mail = {

            from: 'wuzhanfly@163.com',

            subject: name + '社区帐号激活',

            to: email,
            html: await this.PW(type, userId, token),

        };
        // send e-mail
        transporter.sendMail(mail, (error, info) => {

            if (error) {
                return { message: error };
            }
            console.log(info.response);

            return { message: info.response };
        });
    }

    // verifica e-mail
    static async Everifica(userId, param): Promise<any> {
        const msg = {
            code: 1,
            HttpStatus: 200,
            msg: '',
        };
        if (param.token) {

            return await jwt.verify(param.token, conf.session.secrets, (err, decoded) => {
                if (err) {
                    msg.code = ApiErrorCode.VERIFICA_EMAIL_Failure;
                    msg.HttpStatus = HttpStatus.BAD_REQUEST;
                    msg.msg = 'token过期,请前往设置重新验证';
                    console.log(11, msg);

                    return msg;
                } else {
                    const time = moment(new Date()).unix();

                    if (userId === decoded.userId && time > decoded.iat && time < decoded.exp) {
                        msg.code = ApiErrorCode.VERIFICA_EMAIL_SUCCESS;
                        msg.HttpStatus = HttpStatus.BAD_REQUEST;

                        msg.msg = '验证成功';
                        console.log(11, msg);
                        return msg;
                    } else {
                        msg.code = ApiErrorCode.VERIFICA_EMAIL_Failure;
                        msg.HttpStatus = HttpStatus.BAD_REQUEST;
                        msg.msg = '账号有误,请前往设置重新验证';
                        console.log('user.userId：', userId, 'decoded.userId:', decoded.userId, 'time:', time, 'decoded.exp:', decoded.exp);
                        return msg;
                    }
                }
            });
        } else {
            msg.code = ApiErrorCode.VERIFICA_EMAIL_TOKEN;
            msg.HttpStatus = HttpStatus.BAD_REQUEST;
            msg.msg = 'token有误，请前往设置重新验证';
            console.log(msg);
            return msg;
        }

    }

    static async PW(type: number, userId: string, token: string): Promise<any> {
        // 1 => verisica 0 => forget PW
        if ((type * 1) === 1) {
            return '<p>您好：' + userId + '</p>' +
                '<p>我们收到您在' + name + '社区的注册信息，请点击下面的链接来激活帐户：</p>' +
                '<a href="' + host + '/user/verifica/' + userId + '/' + token + '">激活链接</a>' +
                '<p>若您没有在' + name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
                '<p>' + name + '社区 谨上,　此链接有效期为15min!!!</p>';

        } else {
            const No = Math.random().toString().slice(-6);
            return '<p>您好：' + userId + '</p>' +
                '<p>我们收到您在' + name + '社区的重置密码信息，请点击下面的链接来重置密码：</p>' +
                '<a href="' + host + '/user/verifica/' + userId + '/' + No + '/' + token + '">激活链接</a>' +
                '<p>若您没有在' + name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
                '<p>' + name + '社区 谨上,　此链接有效期为10min!!!</p>';
        }

    }
}



