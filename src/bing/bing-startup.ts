import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { HttpExcetpionFilter } from './shared/filters/http-exception.filter';
import { WarningExceptionFilter } from './shared/filters/warning-exception.filter';
import { SwaggerSettings } from './shared/openApi/swagger.settings';
import { ValidationPipe } from './shared/pipes/validation.pipe';
import { ResultWrapperInterceptor } from './shared/interceptors/result-wrapper.interceptor';
import bodyParser = require('body-parser');
import { connectLogger, getLogger } from 'log4js';
import * as express from 'express';
import * as path from 'path';
/**
 * Bing 框架初始化
 */
export class BingStartup {

    /**
     * 初始化框架
     * @param app APP
     */
    public static startup(app: INestApplication & INestExpressApplication): void {
        // 配置全局管道
        app.useGlobalPipes(new ValidationPipe());
        // 配置全局过滤器
        app.useGlobalFilters(new GlobalExceptionFilter(), new HttpExcetpionFilter(), new WarningExceptionFilter());
        // 配置全局拦截器
        app.useGlobalInterceptors(new ResultWrapperInterceptor());
        // 内容格式化
        app.use(bodyParser.json());
        // 启用跨域
        app.enableCors();
        // 写请求日志
        app.use(connectLogger(getLogger('http'), {
            level: 'auto',
            format: (req, res, format) => format(`日志时间：:date  请求地址：:url  请求方法：:method \r\n客户端IP地址：:remote-addr \r\n引用地址：:referrer \r\n客户端信息：:user-agent \r\n响应状态：:status \r\n响应时间：:response-time`)
        }));

        // ejs config
        app.use(express.static(path.join(__dirname, '../libs')));
        app.set('views', path.join(__dirname, '../views'));
        app.set('view engine', 'ejs');
    }

    /**
     * 配置Swagger文档
     * @param settings swagger设置
     * @param app Nest应用
     */
    public static configSwagger(settings: SwaggerSettings, app: INestApplication): void {
        const options = new DocumentBuilder()
            .setTitle(settings.title)
            .setDescription(settings.description)
            .setVersion(settings.version)
            // .setBasePath(settings.basePath)
            .build();

        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup(settings.viewPath, app, document);
    }
}