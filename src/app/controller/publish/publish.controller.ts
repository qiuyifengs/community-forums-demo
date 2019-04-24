import { Controller, Get, Param, Post, Body, Request, Response, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { PublishService } from './publish.service';
import { PostList } from '../../entitys/postList.entity';
import { util } from '../../../bing';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

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
        const msg = {
            code: 10000,
            message: '上传成功！',
            path: file.path.replace('src/libs', ''),
        };
        return msg;
    }

    @Post('articleVideo')
    @UseInterceptors(FileInterceptor('file',
        {
            storage: diskStorage({
                destination: './src/libs/images/articleVideo',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        },
    )) // file对应HTML表单的name属性
    async uploadVideo(@UploadedFile() file, @Body() data) {
        const limitSize = 150 * 1024 * 1024;
        let msg = {
            code: 10000,
            message: '上传成功！',
            path: file.path.replace('src/libs', ''),
        }
        if (file.size > limitSize) {
            msg = {
                code: 10000,
                message: '请上传150M以内的文件',
                path: '',
            };
            delete msg.path;
            fs.unlinkSync(`./src/libs/images/articleVideo/${file.filename}`);
        } else {
            msg = {
                code: 10000,
                message: '上传成功！',
                path: file.path.replace('src/libs', ''),
            };
        }
        return msg;
    }
}
