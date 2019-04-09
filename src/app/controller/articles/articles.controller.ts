import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { User } from '../../entitys/user.entity';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly focusService: ArticlesService) {}

    @Get('/articles')
    @ApiOperation({ title: 'get balance from address'})
    public async index(@Request() req, @Response() res): Promise<any> {
        res.render('articles/articles', { title: '详情页' });
    }

    @Post('articles')
    @ApiOperation({ title: 'get balance from address'})
    register(@Body() params): Promise<User[]> {
        return this.focusService.focus(params);
    }
}
