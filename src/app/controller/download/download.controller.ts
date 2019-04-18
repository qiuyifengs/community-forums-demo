import { Controller, Get, Param, Post, Body, UseGuards, Request, Response, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { DownloadService } from './download.service';
import { User } from '../../entitys/user.entity';

@ApiUseTags()
@Controller()
export class DownloadController {
    constructor(private readonly loginService: DownloadService) { }
    @Get('/download')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ title: 'download page' })
    public async index(@Request() req, @Response() res): Promise<any> {
        res.render('download/download', { title: 'download' });
    }
}
