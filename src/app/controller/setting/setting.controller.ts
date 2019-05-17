import { Controller, Get, Param, Post, Body, Request, Response, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { SettingService } from './setting.service';
import { BbsUser } from '../../entitys/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('account')
export class SettingController {
    constructor(private readonly settingService: SettingService) { }

    @Get('/setting/:userId')
    @ApiOperation({ title: 'get balance from address' })
    public async index(@Request() req, @Response() res, @Param() param): Promise<any> {
        const data = await this.settingService.getUserInfo(param);
        const tel = data.tel ? data.tel.substr(0, 2) + '****' + data.tel.substr(8, data.tel.split('').length) : '';
        const email = data.email.substr(0, 2) + '****' + data.email.substr(-7);
        const result = {
            email,
            tel,
            activity: data.activity,
        };
        res.render('account/setting', { title: '安全设置', result });
    }

    @Get('/losePassword')
    @ApiOperation({ title: 'get balance from address' })
    public async lose(@Request() req, @Response() res, @Param() param): Promise<any> {
        res.render('losePassword/losePassword', { title: '找回密码' });
    }

    @Post('resetPassword')
    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'get balance from User'})
    async resetPassword(@Body() params): Promise<Account[]> {
        return await this.settingService.resetPassword(params);
    }

    @Post('resetEmail')
    @ApiOperation({ title: 'get balance from User'})
    async resetEmail(@Body() params): Promise<Account[]> {
        return await this.settingService.resetEmail(params);
    }

    @Post('validateEmail')
    @ApiOperation({ title: 'get balance from User'})
    async validateEmail(@Body() params): Promise<Account[]> {
        console.log(111111112323, params)
        return await this.settingService.validateEmail(params);
    }

    @Post('getUserInfo')
    @ApiOperation({ title: 'get balance from User'})
    async getUserInfo(@Body() params): Promise<any> {
        const data = await this.settingService.getUserInfo(params);
        const result = {
            activity: data.activity,
        };
        return result;
    }
}
