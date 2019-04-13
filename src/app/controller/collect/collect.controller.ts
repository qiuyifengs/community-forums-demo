import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { CollectService } from './collect.service';

@ApiUseTags('account')
@Controller('account')
export class ReplyController {
    constructor(private readonly collectService: CollectService) {}

    @Get('/collect/:nickName')
    @ApiOperation({ title: 'get balance from address'})
    public async index(@Request() req, @Response() res, @Param() data): Promise<any> {
        const collectList = await this.collectService.getCollectList(data);
        collectList.articleList.forEach((postItem, ind) => {
            collectList.articleList[ind].articleLabel = postItem.articleLabel.split(',');
        });
        console.log(66, collectList)
        res.render('account/collect', { title: '我的收藏', collectList });
    }
    @Get('/collect/:nickName/:page')
    @ApiOperation({ title: 'get balance from postList'})
    public async getArticle(@Param() param): Promise<any> {
        return this.collectService.getCollectList(param);
    }
    @Post('/removeCollect')
    @ApiOperation({ title: 'get balance from address'})
    public async addView(@Body() param): Promise<ReplyController[]> {
        return this.collectService.removeCollect(param);
    }
}
