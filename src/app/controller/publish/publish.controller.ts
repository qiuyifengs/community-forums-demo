import { Controller, Get, Param, Post, Body, Request, Response, UseInterceptors, FileInterceptor, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { PublishService } from './publish.service';
import { AuthGuard } from '@nestjs/passport';
import { BbsPostList } from '../../entitys/postList.entity';
import { util } from '../../../bing';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { uploadConfig } from '../../../bing/common/uploadConfig'

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
        console.log(111, obj)
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
    @UseInterceptors(FileInterceptor('file', uploadConfig))
    async uploadFile(@UploadedFile() file, @Body() data) {
        return {
            code: 10000,
            message: '上传成功！',
            path: file.originalname,
            filename: file.originalname,
        }        
        // if (file) {

            // try {
            //     return util.client.write(file.path)
            //     .then((fileInfo) => {
            //         const msg = {
            //             code: 10000,
            //             message: '上传成功！',
            //             path: fileInfo.fid,
            //             filename: fileInfo.fid,
            //         };
            //         return msg;
            //     });
            // } catch (e) {
            //     console.log(e);
            // }
        // } else {
        //     const msg = {
        //         code: -1,
        //         message: '上传失败！',
        //     };
        //     return msg;
        // }
    }

    @Post('articleVideo')
    @UseInterceptors(FileInterceptor('file', uploadConfig))
    async uploadVideo(@UploadedFile() file, @Body() data) {
        return {
            code: 10000,
            message: '上传成功！',
            path: file.originalname,
            filename: file.originalname,
        }
        // const limitSize = 150 * 1024 * 1024;
        // let msg = {
        //     code: 10000,
        //     message: '上传成功！',
        //     path: '',
        //     filename: '',
        // };
        // if (file) {
        //     if (file.size > limitSize) {
        //         msg = {
        //             code: 10000,
        //             message: '请上传150M以内的文件',
        //             path: '',
        //             filename: '',
        //         };
        //         delete msg.path;
        //     } else {
        //         try {
        //             return util.client.write(file.path)
        //                 .then(async (fileInfo) => {
        //                     return msg = {
        //                         code: 10000,
        //                         message: '上传成功！',
        //                         path: fileInfo.fid,
        //                         filename: fileInfo.fid,
        //                     };
        //                 });
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     }
        //     return msg;
        // } else {
        //     const resmsg = {
        //         code: -1,
        //         message: '上传失败！',
        //     };
        //     return resmsg;
        // }
    }
    @Post('deleteUrl')
    @ApiOperation({ title: 'get balance from data'})
    public async deleteUrl(@Body() params): Promise<any> {
        try {
            const msg = {
                code: 10000,
                message: '删除成功！',
            };
            return util.client.remove(params.fid)
            .then((body) => {
                return msg;
            });
        } catch (e) {
            return e;
        }
    }
}
