import { Controller, Get, Param, Post, Body, Request, Response, FileInterceptor, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
// import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../entitys/user.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { async } from 'rxjs/internal/scheduler/async';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Get('/account/:nickName')
    @ApiOperation({ title: 'get balance from user' })
    public async index(@Request() req, @Response() res, @Param() param): Promise<any> {
        const data = await this.accountService.getUserInfo(param);
        const tel = data.tel ? data.tel.substr(0, 2) + '****' + data.tel.substr(8, data.tel.split('').length) : '';
        const email = data.email.substr(0, 2) + '****' + data.email.substr(-7);
        const headerIcon = data.headerIcon;
        const nickName = data.nickName;
        const personalProfile = data.personalProfile;
        const result = {
            email,
            tel,
            headerIcon,
            nickName,
            personalProfile,
            activity: data.activity,
        };
        res.render('account/account', { title: '个人中心', result });
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
                destination: './src/libs/images/headerIconFile',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        },
    )) // file对应HTML表单的name属性
    async uploadFile(@UploadedFile() file, @Body() data) {
        const params = {
            userId: data.userId,
            nickName: data.nickName,
            personalProfile: data.personalProfile,
            headerIcon: '',
        };
        if (file) {
            params.headerIcon = file.path;
        }
        return await this.accountService.changeUserInfo(params);
    }

    @Post('getUserInfo')
    @ApiOperation({ title: 'get balance from user' })
    async getUserInfo(@Body() param): Promise<any> {
        const data = await this.accountService.getUserInfo(param);
        let msg = {
            code: 1,
            activity: -1,
            headerIcon: '',
        };
        if (data) {
            msg = {
                code: 10000,
                headerIcon: data.headerIcon,
                activity: data.activity,
            };
        } else {
            msg = {
                code: -1,
                headerIcon: '',
                activity: -1,
            };
        }
        return msg;
    }

    @Get('user/changePassWord')
    @ApiOperation({ title: 'get balance from user' })
    public async changePassWord(@Request() req, @Response() res, @Param() param): Promise<any> {
        res.render('account/appChangePw', { title: '修改密码'});
    }

    @Get('user/changeEmail')
    @ApiOperation({ title: 'get balance from user' })
    public async changeEmail(@Request() req, @Response() res, @Param() param): Promise<any> {
        res.render('account/appChangeEmail', { title: '修改邮箱'});
    }
}
