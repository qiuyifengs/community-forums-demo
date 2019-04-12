import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { PublishService } from './publish.service';
import { PostList } from '../../entitys/postList.entity';
import { util } from '../../../bing';

@ApiUseTags('post')
@Controller('post')
export class PublishController {
    constructor(private readonly postsRepository: PublishService) {}
    @Get('/publish/*')
    @ApiOperation({ title: 'get balance from postList'})
    public async index(@Request() req, @Response() res, @Param() param): Promise<any> {
        const obj = {
            menuList: [],
            getLabel: null,
            renderData: null,
        };
        obj.getLabel = JSON.stringify(await this.postsRepository.getLabel());
        obj.menuList = await this.postsRepository.getMenu();
        if (param['0'] !== '') {
            obj.renderData = await this.postsRepository.editArticle(param['0']);
        }
        res.render('publish/publish', { title: 'publish',  obj});
    }

    @Post('publish')
    @ApiOperation({ title: 'get balance from postList'})
    public async publish(@Body() params): Promise<PostList[]> {
        if (params.isEdit === 'false' || !params.isEdit) {
            params.publishTime = await util.dateType.toSecond();
        }
        if (!params.articleId) {
            params.articleId = util.ramdom.random(6) +  util.dateType.getTime();
        }
        params.articleLabel = params.articleLabel ?  params.articleLabel.join(',') : '';
        return this.postsRepository.publish(params);
    }
}
