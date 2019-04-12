import { Controller, Get, Param, Post, Body, Request, Response, Res, FileInterceptor, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { User } from '../../entitys/user.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Get('/account/:userId')
    @ApiOperation({ title: 'get balance from address' })
    public async index(@Request() req, @Response() res, @Param() param): Promise<any> {
        const data = await this.accountService.getUserInfo(param);
        const tel = data.tel ? data.tel.substr(0, 2) + '****' + data.tel.substr(8, data.tel.split('').length) : '';
        const email = data.email.substr(0, 2) + '****' + data.email.substr(-7);
        const result = {
            email,
            tel,
            activity: data.activity,
        };
        res.render('account/account', { title: '个人中心', result });
    }

    // @Post('changeUserInfo')
    // @ApiOperation({ title: 'get balance from User'})
    // addView(@Body() param, @Request() req, @Response() res): Promise<User[]> {
    //     console.log(param, req.files)
    //     return this.accountService.changeUserInfo(param);
    // }

    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file'))
    // uploadFile(@UploadedFile() file, @Body() data) {
    //     console.log(data.name)
    //     return ""
    // }
    @Post('upload')
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
                destination: './file',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        },
    )) // file对应HTML表单的name属性
    async uploadFile(@UploadedFile() file, @Body() body) {
        return file;
    }
}
