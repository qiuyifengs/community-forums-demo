import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { FocusService } from './focus.service';
import { Focus } from '../../entitys/focus.entity';

@Controller('account')
export class FocusController {
    constructor(private readonly focusService: FocusService) {}

    @Get('/focus')
    @ApiOperation({ title: 'get balance from address'})
    public async index(@Request() req, @Response() res): Promise<any> {
        res.render('focus/focus', { title: '我的关注' });
    }
}
