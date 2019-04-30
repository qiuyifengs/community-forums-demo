import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../../bing/common/enums/api.exception';
import { ApiErrorCode } from '../../../bing/common/enums/api-error-code.enum';
import { Repository } from 'typeorm';
import { ArticleDetail } from '../../entitys/articleDetail.entity';
import { CommentsList } from '../../entitys/commentList.entity';
import { ChildrenComments } from '../../entitys/childrenComment.entity';
import { MyCollectionList } from '../../entitys/myCollectionList.entity';
import { PostList } from '../../entitys/postList.entity';
import { BbsUser } from '../../entitys/user.entity';
import { util } from '../../../bing';
import * as curUserId from '../../global';

@Injectable()
export class ArticleDetailService {
    constructor(
        @InjectRepository(PostList)
        private readonly postListRepository: Repository<PostList>,
        @InjectRepository(ArticleDetail)
        private readonly articleRepository: Repository<ArticleDetail>,
        @InjectRepository(MyCollectionList)
        private readonly myCollectRepository: Repository<MyCollectionList>,
        @InjectRepository(CommentsList)
        private readonly commentRepository: Repository<CommentsList>,
        @InjectRepository(ChildrenComments)
        private readonly childrenCommentRepository: Repository<ChildrenComments>,
        @InjectRepository(BbsUser)
        private readonly userRepository: Repository<BbsUser>,
    ) { }

    // getArticle
    async getArticle(param): Promise<any> {
        let commentRes;
        let commentNum = 0;
        const pageCount = param.pageCount ? param.pageCount * 1 : 10;
        const page = param.page ? param.page * 1 * pageCount : 0;
        const totalRes = await this.commentRepository.find({articleId: param.articleId});
        const articleRes = await this.articleRepository.findOne({ ARTICLE_ID: param.articleId }); // article
        const userInfoRes = await this.userRepository.findOne({ USER_ID: articleRes.USER_ID });
        // commentRes = await this.commentRepository.find({ articleId: param.articleId });
        commentRes = await this.commentRepository
                .createQueryBuilder('commentleList')
                .where('commentleList.articleId = :articleId', { articleId: param.articleId })
                .skip(page)
                .take(pageCount)
                .getMany();
        const collectRes = await this.myCollectRepository.findOne({ARTICLE_ID: param.articleId, USER_ID: curUserId.default.userId});
        if (commentRes.length > 0) {
            for (const item of commentRes) {
                const user = await this.userRepository.findOne({ USER_ID: item.userId });
                item.hearderIcon = user.HEADER_ICON;
                const childrenComRes = await this.childrenCommentRepository.find({ articleId: param.articleId, commentId: item.commentId });
                item.childrenComentList = childrenComRes;
                commentNum += childrenComRes.length * 1;
            }
        }
        articleRes.comments = commentRes;
        articleRes.IS_LIKE = collectRes ? collectRes.IS_LIKE : false;
        articleRes.IS_COLLECT = collectRes ? collectRes.IS_COLLECT : false;
        const resObj = Object.assign(articleRes);
        resObj.personalProfile = userInfoRes.PERSONAL_PROFILE;
        resObj.total = totalRes.length;
        resObj.headerIcon = userInfoRes.HEADER_ICON;
        resObj.commentTotal = commentNum + commentRes.length;
        delete resObj.userId;
        return resObj;
    }
    // add comment
    async addComment(param): Promise<any> {
        const dateNum = new Date().getTime().toString().substring(-10);
        const user = await this.userRepository.findOne({NICK_NAME: param.commentatorName});
        if (user.USER_ID !== param.userId) {
            user.HAD_NEWS = true;
            this.userRepository.save(user);
        }
        const comment = new CommentsList();
        comment.userId = param.userId;
        comment.commentatorId = user.USER_ID;
        comment.commentatorName = param.commentatorName;
        comment.articleTitle = param.articleTitle;
        comment.articleId = param.articleId;
        comment.commentContent = param.commentText;
        comment.commentTime = await util.dateType.toSecond();
        comment.commentId = dateNum + util.ramdom.random(6);
        comment.commentUserName = param.nickName;
        const updateArticle = await this.articleRepository.findOne({ ARTICLE_ID: param.articleId });
        updateArticle.COMMENT_ID = comment.commentId;
        updateArticle.COMMENT_COUNT += 1;
        await this.articleRepository.save(updateArticle);
        await this.articleRepository.manager.save(comment);
        const msg = {
            code: ApiErrorCode.SUCCESS,
            commentId: comment.commentId,
            message: '评论成功！',
        };
        return msg;
    }
    // add childrenComment
    async addChildrenComment(param): Promise<any> {
        const user = await this.userRepository.findOne({NICK_NAME: param.author});
        const commentatorUserInfo = await this.userRepository.findOne({NICK_NAME: param.commentatorName});
        const dateNum = new Date().getTime().toString().substring(-11);
        const childrenCom = new ChildrenComments();
        if (user.USER_ID !== param.userId) {
            user.HAD_NEWS = true;
            this.userRepository.save(user);
        }
        childrenCom.userId = param.userId;
        childrenCom.commentUserName = param.nickName;
        childrenCom.author = param.author;
        childrenCom.authorId = user.USER_ID;
        childrenCom.commentatorId = commentatorUserInfo.USER_ID;
        childrenCom.commentatorName = param.commentatorName;
        childrenCom.articleId = param.articleId;
        childrenCom.commentContent = param.commentText;
        childrenCom.commentTime = await util.dateType.toSecond();
        childrenCom.childCommentId = dateNum + util.ramdom.random(6);
        childrenCom.commentId = param.commentId;
        const updateArticle = await this.articleRepository.findOne({ ARTICLE_ID: param.articleId });
        updateArticle.COMMENT_COUNT += 1;
        await this.articleRepository.save(updateArticle);
        await this.articleRepository.manager.save(childrenCom);
        const msg = {
            code: ApiErrorCode.SUCCESS,
            commentId: childrenCom.childCommentId,
            message: '回复成功！',
        };
        return msg;
    }

    //  delete comment
    async deleteComment(param): Promise<any> {
        const msg = {
            code: 0,
            HttpStatus: 200,
            message: '',
        };
        if (param.commentType.toLowerCase() === 'parent') {
            const parComment = await this.commentRepository.findOne({ articleId: param.articleId, commentId: param.commentId });
            const childComment = await this.childrenCommentRepository.find({ articleId: param.articleId, commentId: param.commentId });
            if (parComment) {
                await this.commentRepository.remove(parComment);
                if (childComment.length > 0) {
                    await this.childrenCommentRepository.remove(childComment);
                }
                msg.code = ApiErrorCode.DELETE_SUCCESS;
                msg.message = '删除成功！';
            } else {
                msg.code = ApiErrorCode.REMOVE_FAILT;
                msg.HttpStatus = HttpStatus.BAD_REQUEST;
                msg.message = '删除失败！';
            }
        } else {
            const delChild = await this.childrenCommentRepository.findOne({ articleId: param.articleId, childCommentId: param.commentId });
            if (delChild) {
                await this.childrenCommentRepository.remove(delChild);
                msg.code = ApiErrorCode.DELETE_SUCCESS;
                msg.message = '删除成功！';
            } else {
                msg.code = ApiErrorCode.REMOVE_FAILT;
                msg.HttpStatus = HttpStatus.BAD_REQUEST;
                msg.message = '删除失败！';
            }
        }
        return msg;
    }

    // add like
    async addLike(param): Promise<any> {
        const likeRes =  await this.articleRepository.findOne({ARTICLE_ID: param.articleId});
        const postRes =  await this.articleRepository.findOne({ARTICLE_ID: param.articleId});
        const collectRes = await this.myCollectRepository.findOne({ARTICLE_ID: param.articleId, USER_ID: param.userId});
        const user = await this.userRepository.findOne({NICK_NAME: param.author});
        if (!collectRes) {
            const myCollection = new MyCollectionList();
            likeRes.LIKE_COUNT = likeRes.LIKE_COUNT + 1;
            postRes.LIKE_COUNT = likeRes.LIKE_COUNT;
            likeRes.IS_LIKE = true;
            await this.articleRepository.save(likeRes);
            await this.postListRepository.save(postRes);
            const paramObj = Object.assign(myCollection, likeRes);
            delete paramObj.ID;
            paramObj.USER_ID = param.userId;
            paramObj.AUTHOR_ID = user.USER_ID;
            paramObj.ARTICLE_CONTENT = postRes.ARTICLE_CONTENT;
            paramObj.IS_LIKE = true;
            await this.myCollectRepository.manager.save(paramObj);
            return { code: ApiErrorCode.SUCCESS, isLike: likeRes.IS_LIKE, message: '已标记为喜欢！' };
        } else {
            if (!collectRes.IS_LIKE) {
                likeRes.LIKE_COUNT = likeRes.LIKE_COUNT + 1;
                postRes.LIKE_COUNT = likeRes.LIKE_COUNT;
                likeRes.IS_LIKE = true;
                await this.articleRepository.save(likeRes);
                await this.postListRepository.save(postRes);
                collectRes.IS_LIKE = true;
                await this.myCollectRepository.save(collectRes);
                return { code: ApiErrorCode.SUCCESS, isLike: likeRes.IS_LIKE, message: '已标记为喜欢！' };
            } else {
                likeRes.LIKE_COUNT = (likeRes.LIKE_COUNT - 1) > 0 ? likeRes.LIKE_COUNT - 1 : 0;
                postRes.LIKE_COUNT = likeRes.LIKE_COUNT;
                likeRes.IS_COLLECT = false;
                if (!collectRes.IS_COLLECT) {
                    await this.myCollectRepository.delete({ARTICLE_ID: param.articleId, USER_ID: param.userId});
                } else {
                    collectRes.IS_LIKE = false;
                    await this.myCollectRepository.save(collectRes);
                }
                await this.articleRepository.save(likeRes);
                await this.postListRepository.save(postRes);
                return { code: ApiErrorCode.SUCCESS, isLike: likeRes.IS_LIKE, message: '已移出喜欢！' };
            }
        }
    }

    // add collect
    async addCollect(param): Promise<any> {
        const articleRes =  await this.articleRepository.findOne({ARTICLE_ID: param.articleId});
        const postRes =  await this.articleRepository.findOne({ARTICLE_ID: param.articleId});
        const collectRes = await this.myCollectRepository.findOne({ARTICLE_ID: param.articleId, USER_ID: param.userId});
        const user = await this.userRepository.findOne({NICK_NAME: param.author});
        if (!collectRes) {
            const myCollection = new MyCollectionList();
            articleRes.COLLECT_COUNT = articleRes.COLLECT_COUNT + 1;
            postRes.COLLECT_COUNT = articleRes.COLLECT_COUNT;
            articleRes.IS_LIKE = true;
            await this.articleRepository.save(articleRes);
            await this.postListRepository.save(postRes);
            const paramObj = Object.assign(myCollection, articleRes);
            paramObj.USER_ID = param.userId;
            paramObj.AUTHOR_ID = user.USER_ID;
            paramObj.IS_COLLECT = true;
            paramObj.ARTICLE_CONTENT = postRes.ARTICLE_CONTENT;
            delete paramObj.ID;
            await this.myCollectRepository.save(paramObj);
            return { code: ApiErrorCode.SUCCESS, isCollect: paramObj.IS_COLLECT,  message: '收藏成功！' };
        } else {
            if (!collectRes.IS_COLLECT) {
                articleRes.COLLECT_COUNT = articleRes.COLLECT_COUNT + 1;
                postRes.COLLECT_COUNT = articleRes.COLLECT_COUNT;
                articleRes.IS_LIKE = true;
                await this.articleRepository.save(articleRes);
                await this.postListRepository.save(postRes);
                collectRes.IS_COLLECT = true;
                await this.myCollectRepository.save(collectRes);
                return { code: ApiErrorCode.SUCCESS, isCollect: collectRes.IS_COLLECT,  message: '收藏成功！' };
            } else {
                articleRes.COLLECT_COUNT = (articleRes.COLLECT_COUNT - 1) > 0 ? articleRes.COLLECT_COUNT - 1 : 0;
                postRes.COLLECT_COUNT = articleRes.COLLECT_COUNT;
                articleRes.IS_LIKE = false;
                if (!collectRes.IS_LIKE) {
                    await this.myCollectRepository.delete({ARTICLE_ID: param.articleId, USER_ID: param.userId});
                } else {
                    collectRes.IS_COLLECT = false;
                    await this.myCollectRepository.save(collectRes);
                }
                await this.articleRepository.save(articleRes);
                await this.postListRepository.save(postRes);
                return { code: ApiErrorCode.SUCCESS, isCollect: collectRes.IS_COLLECT,  message: '取消成功！' };
            }
        }
    }

    // add view
    async addView(param): Promise<any> {
        const res =  await this.articleRepository.findOne({ARTICLE_ID: param.articleId});
        const postRes =  await this.articleRepository.findOne({ARTICLE_ID: param.articleId});
        res.VIEW_COUNT = res.VIEW_COUNT + 1;
        postRes.VIEW_COUNT = res.VIEW_COUNT;
        await this.articleRepository.save(res);
        await this.postListRepository.save(postRes);
        return res;
    }
}
