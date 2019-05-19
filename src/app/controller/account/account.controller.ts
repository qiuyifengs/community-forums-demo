import { Controller, Get, Param, Post, Body, Request, Response, FileInterceptor, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { util } from '../../../bing';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Get('/account/:nickName')
    @ApiOperation({ title: 'get balance from user' })
    public async index(@Request() req, @Response() res, @Param() param): Promise<any> {
        const data = await this.accountService.getUserInfo(param);
        const tel = data.TEL ? data.TEL.substr(0, 2) + '****' + data.TEL.substr(8, data.TEL.split('').length) : '';
        const email = data.EMAIL.substr(0, 2) + '****' + data.EMAIL.substr(-7);
        const headerIcon = data.HEADER_ICON;
        const nickName = data.NICK_NAME;
        const personalProfile = data.PERSONAL_PROFILE;
        const result = {
            email,
            tel,
            headerIcon,
            nickName,
            personalProfile,
            activity: data.ACTIVITY,
        };
        res.render('account/personalCenter/account', { title: '个人中心', result });
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
                // destination: './src/libs/images/headerIconFile',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        },
    )) // file对应HTML表单的name属性
    async uploadFile(@UploadedFile() file, @Body() data) {
        // const user = await this.accountService.getUserInfo(data);
        // if (user.USER_ID !== data.userId) {
        //     return {message: '非正常用户！'};
        // }
        const params = {
            userId: data.userId,
            nickName: data.nickName,
            personalProfile: data.personalProfile,
            headerIcon: '',
        };
        try {
            if (file) {
                return util.client.write(file.path)
                .then(async (fileInfo) => {
                    params.headerIcon = fileInfo.fid;
                    return await this.accountService.changeUserInfo(params);
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    @Post('getUserInfo')
    @ApiOperation({ title: 'get balance from user' })
    async getUserInfo(@Body() param): Promise<any> {
        const data = await this.accountService.getUserInfo(param);
        let msg = {
            code: 1,
            activity: -1,
            hadNews: false,
            headerIcon: '',
        };
        if (data) {
            msg = {
                code: 10000,
                headerIcon: data.HEADER_ICON,
                hadNews: data.HAD_NEW,
                activity: data.ACTIVITY,
            };
        } else {
            msg = {
                code: -1,
                headerIcon: '',
                hadNews: false,
                activity: -1,
            };
        }
        return msg;
    }

    @Get('user/changePassWord')
    @ApiOperation({ title: 'get balance from user' })
    public async changePassWord(@Request() req, @Response() res, @Param() param): Promise<any> {
        res.render('account/appChangePw/appChangePw', { title: '修改密码'});
    }

    @Get('user/changeEmail')
    @ApiOperation({ title: 'get balance from user' })
    public async changeEmail(@Request() req, @Response() res, @Param() param): Promise<any> {
        res.render('account/appChangeEmail/appChangeEmail', { title: '修改邮箱'});
    }
}
