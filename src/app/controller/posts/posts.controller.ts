import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';

@ApiUseTags('account')
@Controller('account')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('/posts/:nickName')
    @ApiOperation({ title: 'get balance from postList'})
    public async index(@Request() req, @Response() res, @Param() data): Promise<any> {
        const myArticleList = await this.postsService.myArticleList(data);
        myArticleList.articleList.forEach((postItem, ind) => {
            myArticleList.articleList[ind].ARTICLE_LABEL = postItem.ARTICLE_LABEL.split(',');
        });
        res.render('account/posts/posts', { title: '我的帖子', myArticleList });
    }
    @Get('/posts/:nickName/:page')
    @ApiOperation({ title: 'get balance from postList'})
    public async getArticle(@Param() param): Promise<any> {
        return this.postsService.myArticleList(param);
    }

    @Post('/deleteArticle')
    @ApiOperation({ title: 'get balance from postList'})
    public async deleteArticle(@Body() data): Promise<any> {
        return await this.postsService.deleteArticle(data);
    }
}
