import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ApiException } from '../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { PostList } from '../../entitys/postList.entity';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { Menu } from '../../entitys/menuList.entity';
import { User } from '../../entitys/user.entity';
import { LabelType } from '../../entitys/labelType.entity';
import { LabelList } from '../../entitys/labelList.entity';

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
        @InjectRepository(LabelType)
        private readonly labelTypeRepository: Repository<LabelType>,
        @InjectRepository(LabelList)
        private readonly labelListRepository: Repository<LabelList>,
    ) {}
    // render html
    async getMenu(): Promise<any> {
        return await this.menuRepository.find({isType: true});
    }
    async getLabel(): Promise<any> {
        const labelType = await this.labelTypeRepository.find();
        for (const type of labelType) {
            const labelList = await this.labelListRepository.find({typeId: type.typeId});
            type.labelArr = labelList;
        }
        return labelType;
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
        const msg = {
            code: 1,
            message: '',
            articleId: '',
        };
        let isRes = await this.postsRepository.findOne({ articleId: data.articleId });
        if (data.isEdit !== 'false') {
            isRes = Object.assign(isRes, data);
            isRes.isDrafts = data.isDrafts === 'false' ? false : true;
            await this.postsRepository.save(isRes);
            await this.addArticleDetail(isRes);
            msg.code = ApiErrorCode.SUCCESS;
            if (data.isDrafts !== 'false') {
                msg.articleId = data.articleId;
                msg.message = '保存成功！';
            } else {
                msg.message = '发表成功！';
                msg.articleId = data.articleId;
            }
        } else {
            data.editTime = data.publishTime;
            data.editPerson = data.userId;
            if (isRes) {
                data = Object.assign(isRes, data);
            }
            if (data.isDrafts !== 'false') {
                data.isDrafts = true;
                msg.code = ApiErrorCode.SUCCESS;
                msg.articleId = data.articleId;
                msg.message = '保存成功！';
            } else {
                data.isDrafts = false;
                msg.code = ApiErrorCode.SUCCESS;
                msg.articleId = data.articleId;
                msg.message = '发表成功！';
            }
            await this.addArticleDetail(data);
            const res = await this.postsRepository.save(data);
        }
        return msg;
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
