import { Module } from '@nestjs/common';
import { CorsMiddleware } from '@/bing';
import { TypeOrmModule } from '@nestjs/typeorm';
import modules from './app';
import { ArticleDetail, ChildrenComments, CommentsList, LabelList, LabelType, Menu, MyCollectionList, PostList, BbsUser } from './app/entitys';
// const ormconfig = require('../ormconfig.json');

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '123456',
            database: 'db_data',
            entities: [
                ArticleDetail,
                ChildrenComments,
                CommentsList,
                LabelList,
                LabelType,
                Menu,
                MyCollectionList,
                PostList,
                BbsUser,
            ],
            synchronize: true,

        }), ...modules,
    ],
})

export class ApplicationModule {}
