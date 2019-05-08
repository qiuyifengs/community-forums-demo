import { util } from '../../../bing';
import { Warning } from '../../../bing/core/warning';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

/**
 * 应用程序异常过滤器
 */
@Catch(Warning)
export class WarningExceptionFilter implements ExceptionFilter {

    /**
     * 操作库
     */
    protected util = util;

    /**
     * 抛出异常
     * @param exception Http异常
     * @param host 主机参数
     */
    catch(exception: Warning, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        this.util.log.warn({
            title: '应用程序异常',
            exception,
            request: {
                headers: request.headers,
                method: request.method,
                url: request.url,
                originalUrl: request.originalUrl,
                params: request.params,
                query: request.query,
                body: request.body,
                route: request.route,
                ip: request.ip
            },
        });

        response
            .status(200)
            .json({
                code: util.helper.toInt(exception.code),
                message: exception.message,
                operationTime: util.moment().utc().format('YYYY-MM-DD hh:mm:ss.SSS'),
            });
    }
}