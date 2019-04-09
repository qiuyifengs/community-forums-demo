import { Controller, Get, Param, Post, Body, Request, Response } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { EJSService } from './ejs.service';
import { TransferDto, BaseDto } from './dto';

@ApiUseTags('ejs')
@Controller('ejs')
export class DposController {

    constructor(private readonly ejsService: EJSService) {}

    @Get('/')
    @ApiOperation({ title: 'get balance from address'})
    public async index(@Request() req, @Response() res): Promise<any> {
        res.render('users', { title: 'users', name: 'Tom' });
    }

    @Post('ransfer')
    @ApiOperation({ title: 'get balance from address'})
    public async users(@Body() dto: TransferDto): Promise<any> {
        return this.ejsService.transfer(dto);
    }
}
