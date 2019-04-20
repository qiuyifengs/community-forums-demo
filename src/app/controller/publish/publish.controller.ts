import { Controller, Get, Param, Post, Body, Request, Response, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { PublishService } from './publish.service';
import { PostList } from '../../entitys/postList.entity';
import { util } from '../../../bing';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
        console.log(obj)
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

    @Post('articleImg')
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
                destination: './src/libs/images/articleFile',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        },
    )) // file对应HTML表单的name属性
    async uploadFile(@UploadedFile() file, @Body() data) {
        // const params = {
        //     userId: data.userId,
        //     nickName: data.nickName,
        //     personalProfile: data.personalProfile,
        //     headerIcon: '',
        // };
        // if (file) {
        //     params.headerIcon = file.path;
        // }
        console.log(file)
        const msg = {
            code: 10000,
            message: '上传成功！',
            path: file.path.replace('src/libs', ''),
        };
        return msg;
    }
}
