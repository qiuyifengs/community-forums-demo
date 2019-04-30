import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ApiException } from '../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { BbsPostList } from '../../entitys/postList.entity';
import { BbsArticleDetail } from '../../entitys/articleDetail.entity';
import { BbsMenu } from '../../entitys/menuList.entity';
import { BbsUser } from '../../entitys/user.entity';
import { BbsLabelType } from '../../entitys/labelType.entity';
import { BbsLabelList } from '../../entitys/labelList.entity';

@Injectable()
export class PublishService {
    constructor(
        @InjectRepository(BbsPostList)
        private readonly postsRepository: Repository<BbsPostList>,
        @InjectRepository(BbsArticleDetail)
        private readonly articleRepository: Repository<BbsArticleDetail>,
        @InjectRepository(BbsMenu)
        private readonly menuRepository: Repository<BbsMenu>,
        @InjectRepository(BbsUser)
        private readonly userRepository: Repository<BbsUser>,
        @InjectRepository(BbsLabelType)
        private readonly labelTypeRepository: Repository<BbsLabelType>,
        @InjectRepository(BbsLabelList)
        private readonly labelListRepository: Repository<BbsLabelList>,
    ) {}
    // render html
    async getMenu(): Promise<any> {
        return await this.menuRepository.find({IS_TYPE: true});
    }
    async getLabel(): Promise<any> {
        const labelType = await this.labelTypeRepository.find();
        for (const type of labelType) {
            const labelList = await this.labelListRepository.find({TYPE_ID: type.TYPE_ID});
            type.labelArr = labelList;
        }
        return labelType;
    }
    // edit article
    async editArticle(data): Promise<any> {
        if (data) {
            const res = await this.articleRepository.findOne({ ARTICLE_ID: data });
            return res;
        }
    }
    // publish
    async publish(data): Promise<any> {
        const userInfo = await this.userRepository.findOne({ USER_ID: data.userId });
        data.author = userInfo.NICK_NAME;
        const msg = {
            code: 1,
            message: '',
            articleId: '',
        };
        let isRes = await this.postsRepository.findOne({ ARTICLE_ID: data.articleId });
        if (data.isEdit !== 'false') {
            isRes = Object.assign(isRes, data);
            isRes.IS_DRAFTS = data.isDrafts === 'false' ? false : true;
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
            let publishData = {
                USER_ID: data.userId,
                IS_EDIT: data.isEdit,
                IS_DRAFTS: data.isDrafts,
                ARTICLE_ID: data.articleId,
                ARTICLE_TITLE: data.articleTitle,
                ARTICLE_CONTENT: data.articleContent,
                ARTICLE_TYPE: data.articleType,
                ARTICLE_LABEL: data.articleLabel,
                CREATED: data.publishTime,
                AUTHOR: data.author,
                EDIT_TIME: data.editTime,
                EDIT_PERSON: data.editPerson,
            };
            if (isRes) {
                publishData = Object.assign(isRes, publishData);
            }
            if (data.isDrafts !== 'false') {
                publishData.IS_DRAFTS = true;
                msg.code = ApiErrorCode.SUCCESS;
                msg.articleId = data.articleId;
                msg.message = '保存成功！';
            } else {
                publishData.IS_DRAFTS = false;
                msg.code = ApiErrorCode.SUCCESS;
                msg.articleId = data.articleId;
                msg.message = '发表成功！';
            }
            await this.addArticleDetail(publishData);
            const res = await this.postsRepository.save(publishData);
        }
        return msg;
    }
    // Store articles in articleDetail
    async addArticleDetail(data): Promise<any> {
        if (data.IS_EDIT === 'false') {
            const articleDetail = new BbsArticleDetail();
            const addObj = Object.assign(articleDetail, data);
            await this.postsRepository.manager.save(addObj);
        } else {
            let editRes = await this.articleRepository.findOne({ ARTICLE_ID: data.ARTICLE_ID });
            editRes = Object.assign(editRes, data);
            await this.articleRepository.save(editRes);
        }
    }
}
