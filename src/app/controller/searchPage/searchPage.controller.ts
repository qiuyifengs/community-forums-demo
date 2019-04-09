import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { SearchPageService } from './searchPage.service';
import { PostList } from '../../entitys/postList.entity';

@ApiUseTags('post')
@Controller('post')
export class SearchPageController {
    constructor(private readonly searchRepository: SearchPageService) {}
    @Get('/search/:keyword')
    @ApiOperation({ title: 'get balance from articleDetail'})
    public async index(@Request() req, @Response() res, @Param() keyword): Promise<any> {
        const articleList = await this.searchRepository.searchArticle(keyword);
        res.render('searchPage/searchPage', { title: 'searchPage', articleList });
    }
}
