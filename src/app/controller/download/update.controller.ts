import { Controller, Get, Param, Post, Body, UseGuards, Request, Response, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { UpdateService } from './update.service';

@ApiUseTags()
@Controller()
export class UpdateController {
    constructor(private readonly loginService: UpdateService) { }
    @Get('/update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ title: 'update page' })
    public async index(@Request() req, @Response() res): Promise<any> {
        res.render('download/update', { title: 'update' });
    }

    @Get('/appDownload')
    @ApiOperation({ title: 'download page' })
    public async download(@Request() req, @Response() res): Promise<any> {
        res.render('download/appDownload', { title: 'download' });
    }

}
