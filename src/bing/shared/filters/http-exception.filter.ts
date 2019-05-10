import { util } from '../../../bing';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
const fs = require('fs');
const path = require('path');

/**
 * Http 异常过滤器
 */
@Catch(HttpException)
export class HttpExcetpionFilter implements ExceptionFilter {

    /**
     * 操作库
     */
    protected util = util;

    /**
     * 抛出异常
     * @param exception Http异常
     * @param host 主机参数
     */
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        this.util.log.error({
            title: 'Http Request Error', request: {
                headers: request.headers,
                method: request.method,
                url: request.url,
                originalUrl: request.originalUrl,
                params: request.params,
                query: request.query,
                body: request.body,
                route: request.route,
                ip: request.ip,
            },
        }, exception);

        // response
        //     .status(exception.getStatus())
        //     .json({
        //         code: util.helper.toInt(exception.getStatus()),
        //         message: exception.message.error,
        //         operationTime: util.moment().utc().format('YYYY-MM-DD hh:mm:ss.SSS'),
        //     });
        const message = {
            code: util.helper.toInt(exception.getStatus()),
            message: exception.message.error,
            operationTime: util.moment().utc().format('YYYY-MM-DD hh:mm:ss.SSS'),
        };
        response.render('error', { message });
    }
}
