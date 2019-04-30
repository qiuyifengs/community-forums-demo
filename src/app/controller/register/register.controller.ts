import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { BbsUser } from '../../entitys/user.entity';

@ApiUseTags('user')
@Controller('user')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    @Get('/register')
    @ApiOperation({ title: 'get balance from user' })
    public async index(@Request() req, @Response() res): Promise<any> {
        res.render('register/register', { title: 'register' });
    }

    @Post('register')
    @ApiOperation({ title: 'get balance from user' })
    register(@Body() params): Promise<BbsUser[]> {
        return this.registerService.register(params);
    }
  
}
