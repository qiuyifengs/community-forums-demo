import { EJSModule } from './controller/demo/ejs.module';
import { IndexModule } from './controller/index/index.module';
import { LoginModule } from './controller/login/login.module';
import { RegisterModule } from './controller/register/register.module';
import { PostsModule } from './controller/posts/posts.module';
import { PublishModule } from './controller/publish/publish.module';
import { AccountModule } from './controller/account/account.module';
import { SettingModule } from './controller/setting/setting.module';
import { ReplyModule } from './controller/reply/reply.module';
import { ArticlesModule } from './controller/articles/articles.module';
import { ArticleDetailModule } from './controller/articleDetail/articleDetail.module';
import { CollectModule } from './controller/collect/collect.module';
import { SearchPageModule } from './controller/searchPage/searchPage.module';
import { AuthModule } from './controller/auth/auth.module';
import { UpdateModule } from './controller/download/update.module';

const modules = [
    EJSModule,
    IndexModule,
    LoginModule,
    RegisterModule,
    PostsModule,
    AccountModule,
    PublishModule,
    SettingModule,
    ReplyModule,
    ArticlesModule,
    ArticleDetailModule,
    CollectModule,
    SearchPageModule,
    AuthModule,
    UpdateModule,
];

export default modules;
