import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CorsMiddleware } from './bing';
import { TypeOrmModule } from '@nestjs/typeorm';
import modules from './app';
import { BbsArticleDetail, BbsChildrenComments, BbsCommentsList, BbsLabelList, BbsLabelType, BbsMenu, BbsMyCollectionList, BbsMyLikeList, BbsPostList, BbsUser } from './app/entitys';
// const ormconfig = require('../ormconfig.json');

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '7.7.2.11',
            port: 3306,
            username: 'root',
            password: 'p82Jser2Sb32F2sl4Gsir02Fe',
            database: 'example',
            entities: [
                BbsArticleDetail,
                BbsChildrenComments,
                BbsCommentsList,
                BbsLabelList,
                BbsLabelType,
                BbsMenu,
                BbsMyCollectionList,
                BbsMyLikeList,
                BbsPostList,
                BbsUser,
            ],
            synchronize: true,

        }), ...modules,
    ],
})
export class ApplicationModule implements NestModule {
    /**
	 * 配置中间件
	 * @param consumer 中间件
	*/
  	configure(consumer: MiddlewareConsumer): void {
        consumer.apply(CorsMiddleware).forRoutes({
          path: '*',
          method: RequestMethod.ALL,
        });
    }
}
