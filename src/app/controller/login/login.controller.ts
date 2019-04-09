import { Controller, Get, Param, Post, Body, UseGuards, Request, Response, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { User } from '../../entitys/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { async } from 'rxjs/internal/scheduler/async';

@ApiUseTags('user')
@Controller('user')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }
    @Get('/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ title: 'login page' })
    public async index(@Request() req, @Response() res): Promise<any> {
        res.render('login/login', { title: 'login' });
    }

//    @UseGuards(AuthGuard('jwt'))
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ title: 'user login' })
    async login(@Body() params): Promise<User[]> {

        return this.loginService.login(params);
    }

    @Get('verifica/:userId/:token')
    @ApiOperation({ title: 'verifica userId' })
    public async verifica(@Request() req, @Response() res): Promise<any> {
        res.render('account/verifica', { title: 'verifica' });
    }
    @Post('Everifica')
    @ApiOperation({ title: 'verifica e-mail' })
    public async Everifica(@Body() param): Promise<any> {
        return this.loginService.Emailverifica(param);
    }
}
