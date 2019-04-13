import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { ReplyService } from './reply.service';
import { User } from '../../entitys/user.entity';

@ApiUseTags('account')
@Controller('account')
export class ReplyController {
    constructor(private readonly replyService: ReplyService) {}

    @Get('/reply/:nickName')
    @ApiOperation({ title: 'get balance from address'})
    public async index(@Request() req, @Response() res, @Param() data): Promise<any> {
        const answerList = await this.replyService.getComments(data);
        res.render('account/reply', { title: '我的回复', answerList });
    }

    @Get('/reply/:nickName/:page')
    @ApiOperation({ title: 'get balance from address'})
    public async getCommentPage(@Param() data): Promise<any> {
        return await this.replyService.getComments(data);
    }
}
