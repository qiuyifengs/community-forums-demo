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
import { User } from '../../entitys/user.entity';
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
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // getArticle
    async getArticle(param): Promise<any> {
        let commentRes;
        let commentNum = 0;
        const pageCount = param.pageCount ? param.pageCount * 1 : 10;
        const page = param.page ? (param.page - 1) * 1 * pageCount : 0;
        const totalRes = await this.commentRepository.find({articleId: param.articleId});
        const articleRes = await this.articleRepository.findOne({ articleId: param.articleId }); // article
        const userInfoRes = await this.userRepository.findOne({ userId: articleRes.userId });
        // commentRes = await this.commentRepository.find({ articleId: param.articleId });
        commentRes = await this.commentRepository
                .createQueryBuilder('commentleList')
                .where('commentleList.articleId = :articleId', { articleId: param.articleId })
                .skip(page)
                .take(pageCount)
                .getMany();
        const collectRes = await this.myCollectRepository.findOne({articleId: param.articleId, userId: curUserId.default.userId});
        if (commentRes.length > 0) {
            for (const item of commentRes) {
                const user = await this.userRepository.findOne({ userId: item.userId });
                item.hearderIcon = user.headerIcon;
                const childrenComRes = await this.childrenCommentRepository.find({ articleId: param.articleId, commentId: item.commentId });
                item.childrenComentList = childrenComRes;
                commentNum += childrenComRes.length * 1;
            }
        }
        articleRes.comments = commentRes;
        articleRes.isLike = collectRes ? collectRes.isLike : false;
        articleRes.isCollect = collectRes ? collectRes.isCollect : false;
        const resObj = Object.assign(articleRes);
        resObj.personalProfile = userInfoRes.personalProfile;
        resObj.total = totalRes.length;
        resObj.headerIcon = userInfoRes.headerIcon;
        resObj.commentTotal = commentNum + commentRes.length;
        delete resObj.userId;
        console.log(resObj.comments)
        return resObj;
    }
    // add comment
    async addComment(param): Promise<any> {
        const dateNum = new Date().getTime().toString().substring(-10);
        const user = await this.userRepository.findOne({nickName: param.commentatorName});
        const comment = new CommentsList();
        comment.userId = param.userId;
        comment.commentatorId = user.userId;
        comment.commentatorName = param.commentatorName;
        comment.articleTitle = param.articleTitle;
        comment.articleId = param.articleId;
        comment.commentContent = param.commentText;
        comment.commentTime = await util.dateType.toSecond();
        comment.commentId = dateNum + util.ramdom.random(6);
        comment.commentUserName = param.nickName;
        const updateArticle = await this.articleRepository.findOne({ articleId: param.articleId });
        updateArticle.commentId = comment.commentId;
        updateArticle.commentCount += 1;
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
        const user = await this.userRepository.findOne({nickName: param.author});
        const dateNum = new Date().getTime().toString().substring(-11);
        const childrenCom = new ChildrenComments();
        childrenCom.userId = param.userId;
        childrenCom.commentUserName = param.nickName;
        childrenCom.author = param.author;
        childrenCom.commentatorId = user.userId;
        childrenCom.commentatorName = param.commentatorName;
        childrenCom.articleId = param.articleId;
        childrenCom.commentContent = param.commentText;
        childrenCom.commentTime = await util.dateType.toSecond();
        childrenCom.childCommentId = dateNum + util.ramdom.random(6);
        childrenCom.commentId = param.commentId;
        const updateArticle = await this.articleRepository.findOne({ articleId: param.articleId });
        updateArticle.commentCount += 1;
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
        const likeRes =  await this.articleRepository.findOne({articleId: param.articleId});
        const postRes =  await this.articleRepository.findOne({articleId: param.articleId});
        const collectRes = await this.myCollectRepository.findOne({articleId: param.articleId, userId: param.userId});
        if (!collectRes) {
            const myCollection = new MyCollectionList();
            likeRes.likeCount = likeRes.likeCount + 1;
            postRes.likeCount = likeRes.likeCount;
            likeRes.isLike = true;
            await this.articleRepository.save(likeRes);
            await this.postListRepository.save(postRes);
            const paramObj = Object.assign(myCollection, likeRes);
            delete paramObj.serialNum;
            paramObj.userId = param.userId;
            paramObj.articleContent = postRes.articleContent;
            paramObj.isLike = true;
            await this.myCollectRepository.manager.save(paramObj);
            return { message: '已标记为喜欢！' };
        } else {
            if (!collectRes.isLike) {
                likeRes.likeCount = likeRes.likeCount + 1;
                postRes.likeCount = likeRes.likeCount;
                likeRes.isLike = true;
                await this.articleRepository.save(likeRes);
                await this.postListRepository.save(postRes);
                collectRes.isLike = true;
                await this.myCollectRepository.save(collectRes);
                return { message: '已标记为喜欢！' };
            } else {
                likeRes.likeCount = (likeRes.likeCount - 1) > 0 ? likeRes.likeCount - 1 : 0;
                postRes.likeCount = likeRes.likeCount;
                likeRes.isLike = false;
                if (!collectRes.isCollect) {
                    await this.myCollectRepository.delete({articleId: param.articleId, userId: param.userId});
                } else {
                    collectRes.isLike = false;
                    await this.myCollectRepository.save(collectRes);
                }
                await this.articleRepository.save(likeRes);
                await this.postListRepository.save(postRes);
                return { message: '已移出喜欢！' };
            }
        }
    }

    // add collect
    async addCollect(param): Promise<any> {
        const articleRes =  await this.articleRepository.findOne({articleId: param.articleId});
        const postRes =  await this.articleRepository.findOne({articleId: param.articleId});
        const collectRes = await this.myCollectRepository.findOne({articleId: param.articleId, userId: param.userId});
        if (!collectRes) {
            const myCollection = new MyCollectionList();
            articleRes.collectCount = articleRes.collectCount + 1;
            postRes.collectCount = articleRes.collectCount;
            articleRes.isLike = true;
            await this.articleRepository.save(articleRes);
            await this.postListRepository.save(postRes);
            const paramObj = Object.assign(myCollection, articleRes);
            paramObj.userId = param.userId;
            paramObj.isCollect = true;
            paramObj.articleContent = postRes.articleContent;
            delete paramObj.serialNum;
            await this.myCollectRepository.save(paramObj);
            return { message: '收藏成功！' };
        } else {
            if (!collectRes.isCollect) {
                articleRes.collectCount = articleRes.collectCount + 1;
                postRes.collectCount = articleRes.collectCount;
                articleRes.isLike = true;
                await this.articleRepository.save(articleRes);
                await this.postListRepository.save(postRes);
                collectRes.isCollect = true;
                await this.myCollectRepository.save(collectRes);
                return { message: '收藏成功！' };
            } else {
                articleRes.collectCount = (articleRes.collectCount - 1) > 0 ? articleRes.collectCount - 1 : 0;
                postRes.collectCount = articleRes.collectCount;
                articleRes.isLike = false;
                if (!collectRes.isLike) {
                    await this.myCollectRepository.delete({articleId: param.articleId, userId: param.userId});
                } else {
                    collectRes.isCollect = false;
                    await this.myCollectRepository.save(collectRes);
                }
                await this.articleRepository.save(articleRes);
                await this.postListRepository.save(postRes);
                return { message: '取消成功！' };
            }
        }
    }

    // add view
    async addView(param): Promise<any> {
        const res =  await this.articleRepository.findOne({articleId: param.articleId});
        const postRes =  await this.articleRepository.findOne({articleId: param.articleId});
        res.viewCount = res.viewCount + 1;
        postRes.viewCount = res.viewCount;
        await this.articleRepository.save(res);
        await this.postListRepository.save(postRes);
        return res;
    }
}
