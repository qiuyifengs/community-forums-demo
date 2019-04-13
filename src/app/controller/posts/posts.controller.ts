import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { PostList } from '../../entitys/postList.entity';

@ApiUseTags('account')
@Controller('account')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('/posts/:nickName')
    @ApiOperation({ title: 'get balance from postList'})
    public async index(@Request() req, @Response() res, @Param() data): Promise<any> {
        const myArticleList = await this.postsService.myArticleList(data);
        myArticleList.articleList.forEach((postItem, ind) => {
            myArticleList.articleList[ind].articleLabel = postItem.articleLabel.split(',');
        });
        res.render('account/posts', { title: '我的帖子', myArticleList });
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
