import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { ArticleDetailService } from './articleDetail.service';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { CommentsList } from '../../entitys/commentList.entity';
import { PostList } from '../../entitys/postList.entity';
import * as curUserId from '../../global';

@ApiUseTags('post')
@Controller('post')
export class ArticleDetailController {
    constructor(
        private readonly postsRepository: ArticleDetailService,
    ) { }
    @Get('/articleDetail/:articleId')
    @ApiOperation({ title: 'get balance from articleDetail' })
    public async index(@Request() req, @Response() res, @Param() param): Promise<any> {
        const article = await this.postsRepository.getArticle(param);
        article.articleLabel = article.articleLabel.split(',');
        res.render('articleDetail/articleDetail', { title: 'articleDetail', article });
    }
    @Get('/articleDetail/:articleId/:page')
    @ApiOperation({ title: 'get balance from commentList' })
    public async getComment(@Param() param): Promise<CommentsList[]> {
        return this.postsRepository.getArticle(param);
    }

    @Get('/preview/:articleId')
    @ApiOperation({ title: 'get balance from postList'})
    public async preview(@Request() req, @Response() res, @Param() param): Promise<any> {
        const article = await this.postsRepository.getArticle(param);
        article.articleLabel = article.articleLabel.split(',');
        console.log(article)
        res.render('publish/preview', { title: 'preview', article });
    }


    @Post('addComment')
    @ApiOperation({ title: 'get balance from commentList' })
    public async addComment(@Body() param): Promise<CommentsList[]> {
        return this.postsRepository.addComment(param);
    }

    @Post('addChildrenComment')
    @ApiOperation({ title: 'get balance from childrenCommentList' })
    public async addChildrenComment(@Body() param): Promise<CommentsList[]> {
        return this.postsRepository.addChildrenComment(param);
    }

    @Post('deleteComment')
    @ApiOperation({ title: 'get balance from childrenCommentList' })
    public async deleteComment(@Body() param): Promise<CommentsList[]> {
        return this.postsRepository.deleteComment(param);
    }

    @Post('addLike')
    @ApiOperation({ title: 'get balance from postList' })
    public async addLike(@Body() param): Promise<PostList[]> {
        return this.postsRepository.addLike(param);
    }

    @Post('addCollect')
    @ApiOperation({ title: 'get balance from postList' })
    public async addCollect(@Body() param): Promise<PostList[]> {
        return this.postsRepository.addCollect(param);
    }

    @Post('addView')
    @ApiOperation({ title: 'get balance from postList' })
    public async addView(@Body() param): Promise<PostList[]> {
        curUserId.default.userId = param.userId;
        return this.postsRepository.addView(param);
    }
}
