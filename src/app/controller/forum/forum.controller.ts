import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { Forum } from '../../entitys/forum.entity';

@Controller('forum')
export class ForumController {
    constructor(private readonly forumService: ForumService) {}

    @Get('/forum')
    @ApiOperation({ title: 'get balance from address'})
    public async index(@Request() req, @Response() res): Promise<any> {
        res.render('forum/forum', { title: '社区论坛' });
    }

    @Post('forum')
    @ApiOperation({ title: 'get balance from address'})
    register(@Body() params): Promise<Forum[]> {
        return this.forumService.forum(params);
    }
}
