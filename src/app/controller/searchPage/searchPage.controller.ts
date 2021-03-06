import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { SearchPageService } from './searchPage.service';

@ApiUseTags('post')
@Controller('post')
export class SearchPageController {
    constructor(private readonly searchRepository: SearchPageService) {}
    @Get('/search/:keyword')
    @ApiOperation({ title: 'get balance from articleDetail'})
    public async index(@Request() req, @Response() res, @Param() keyword): Promise<any> {
        const postList = await this.searchRepository.searchArticle(keyword);
        postList.data.forEach((postItem, ind) => {
            postList.data[ind].ARTICLE_LABEL = postItem.ARTICLE_LABEL.split(',');
        });
        res.render('searchPage/searchPage', { title: 'searchPage', postList });
    }

    @Get('/search/:keyword/:page')
    @ApiOperation({ title: 'get balance from articleDetail'})
    public async getPage(@Param() keyword): Promise<any> {
        const postList = await this.searchRepository.searchArticle(keyword);
        postList.data.forEach((postItem, ind) => {
            postList.data[ind].ARTICLE_LABEL = postItem.ARTICLE_LABEL.split(',');
        });
        return postList;
    }
}
