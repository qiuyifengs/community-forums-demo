import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { IndexService } from './index.service';

@ApiUseTags('/')
@Controller()
export class IndexController {
    constructor(private readonly indexRepository: IndexService) {}
    @Get('/')
    @ApiOperation({ title: 'get balance from login'})
    public async index(@Request() req, @Response() res, @Param() data): Promise<any> {
        const postList = await this.indexRepository.getPostList(data);
        postList.articleList.forEach((postItem, ind) => {
            postList.articleList[ind].ARTICLE_LABEL = postItem.ARTICLE_LABEL.split(',');
        });
        res.render('index', { title: 'index', postList });
    }

    @Get('topic/:articleType')
    @ApiOperation({ title: 'get balance from postList'})
    public async getPostList(@Request() req, @Response() res, @Param() param): Promise<any> {
        const postList = await this.indexRepository.getPostList(param);
        postList.articleList.forEach((postItem, ind) => {
            postList.articleList[ind].ARTICLE_LABEL = postItem.ARTICLE_LABEL.split(',');
        });
        res.render('index', { title: 'index', postList });
    }
    @Get('topic/:articleType/:page')
    @ApiOperation({ title: 'get balance from postList'})
    public async getPageList(@Param() param): Promise<any> {
        // const postList = await this.indexRepository.getPostList(param);
        return this.indexRepository.getPostList(param);
    }
    @Post('/viewCount')
    @ApiOperation({ title: 'get balance from postList'})
    public async viewCount(@Body() data): Promise<any> {
        const postList = await this.indexRepository.viewCount(data);
    }
}
