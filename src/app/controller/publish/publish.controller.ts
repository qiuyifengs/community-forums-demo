import { Controller, Get, Param, Post, Body, Request, Response, UseInterceptors, FileInterceptor, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { PublishService } from './publish.service';
import { AuthGuard } from '@nestjs/passport';
import { BbsPostList } from '../../entitys/postList.entity';
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
    // @UseGuards(AuthGuard('jwt'))
    @Post('publish')
    @ApiOperation({ title: 'get balance from postList'})
    public async publish(@Body() params): Promise<BbsPostList[]> {
        if (params.isEdit === 'false' || !params.isEdit) {
            params.publishTime = await util.dateType.getTime();
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
    ))
    async uploadFile(@UploadedFile() file, @Body() data) {
        console.log(file)
        const msg = {
            code: 10000,
            message: '上传成功！',
            path: file.path.replace('src/libs', ''),
            filename: file.filename,
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
    ))
    async uploadVideo(@UploadedFile() file, @Body() data) {
        const limitSize = 150 * 1024 * 1024;
        let msg = {
            code: 10000,
            message: '上传成功！',
            path: file.path.replace('src/libs', ''),
            filename: '',
        };
        if (file.size > limitSize) {
            msg = {
                code: 10000,
                message: '请上传150M以内的文件',
                path: '',
                filename: '',
            };
            delete msg.path;
            fs.unlinkSync(`./src/libs/images/articleVideo/${file.filename}`);
        } else {
            msg = {
                code: 10000,
                message: '上传成功！',
                path: file.path.replace('src/libs', ''),
                filename: file.filename,
            };
        }
        return msg;
    }
    @Post('deleteUrl')
    @ApiOperation({ title: 'get balance from data'})
    public async deleteUrl(@Body() params): Promise<any> {
        const delUrl = JSON.parse(params.urlArr);
        delUrl.forEach(itemUrl => {
            fs.unlinkSync(`./src/libs${itemUrl}`);
        });
        const msg = {
            code: 10000,
            message: '删除成功！',
        };
        return msg;
    }
}
