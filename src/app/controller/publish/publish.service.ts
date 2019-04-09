import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ApiException } from '../../bing/common/enums/api.exception';
// import { ApiErrorCode } from '../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { Menu } from '../../entitys/menuList.entity';
import { User } from '../../entitys/user.entity';

@Injectable()
export class PublishService {
    constructor(
        @InjectRepository(PostList)
        private readonly postsRepository: Repository<PostList>,
        @InjectRepository(ArticleDetail)
        private readonly articleRepository: Repository<ArticleDetail>,
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    // render html
    async getMenu(): Promise<any> {
        return await this.menuRepository.find({isType: true});
    }
    // edit article
    async editArticle(data): Promise<any> {
        if (data) {
            const res = await this.articleRepository.findOne({ articleId: data });
            return res;
        }
    }
    // publish
    async publish(data): Promise<any> {
        const userInfo = await this.userRepository.findOne({ userId: data.userId });
        data.author = userInfo.nickName;
        await this.addArticleDetail(data);
        if (data.isEdit !== 'false') {
            let editRes = await this.postsRepository.findOne({ articleId: data.articleId });
            editRes = Object.assign(editRes, data);
            await this.postsRepository.save(editRes);
        } else {
            if (data.isDrafts !== 'false') {
                data.isDrafts = true;
            } else {
                data.isDrafts = false;
            }
            data.editTime = data.publishTime;
            data.editPerson = data.userId;
            const res = await this.postsRepository.save(data);
        }
        return {message: '发表成功！'};
    }
    // Store articles in articleDetail
    async addArticleDetail(data): Promise<any> {
        if (data.isEdit === 'false') {
            const articleDetail = new ArticleDetail();
            const addObj = Object.assign(articleDetail, data);
            await this.postsRepository.manager.save(addObj);
        } else {
            let editRes = await this.articleRepository.findOne({ articleId: data.articleId });
            editRes = Object.assign(editRes, data);
            await this.articleRepository.save(editRes);
        }
    }
}
