import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerSettings, BingStartup, util } from './bing';
import * as express from 'express';
const instance = express();

async function bootstrap() {
    util.log.replaceConsole();
    util.client.connect();
    const app = await NestFactory.create(ApplicationModule, instance);

    // 配置Swagger文档
    const swaggerSettings = new SwaggerSettings();
    swaggerSettings.title = 'ejs';
    swaggerSettings.description = 'ejs demo';
    BingStartup.configSwagger(swaggerSettings, app);

    // 启动应用
    BingStartup.startup(app);

    await app.listen(3002);
}
bootstrap();
