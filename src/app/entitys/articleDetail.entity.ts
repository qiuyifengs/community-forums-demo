import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { BbsPostList } from './postList.entity';
import { BbsCommentsList } from './commentList.entity';
@Entity()
export class BbsArticleDetail {
    @PrimaryGeneratedColumn() ID: number;
    // userId
    @Column() USER_ID: string;
    // title
    @Column() ARTICLE_TITLE: string;
    // articleId
    @Column() ARTICLE_ID: string;
    // articleContent
    @Column({length: 12000}) ARTICLE_CONTENT: string;
    // articleType
    @Column() ARTICLE_TYPE: string;
    // articleLabel
    @Column() ARTICLE_LABEL: string;
    // author
    @Column() AUTHOR: string;
    // commentId
    @Column({ default: null }) COMMENT_ID: string;
    // viewCount
    @Column({ default: 0 }) VIEW_COUNT: number;
    // collectCount
    @Column({ default: 0 }) COLLECT_COUNT: number;
    // likeCount
    @Column({ default: 0 }) LIKE_COUNT: number;
    // commentCount
    @Column({ default: 0 }) COMMENT_COUNT: number;
     // isLike
    //  @Column({ default: false }) IS_LIKE: boolean;
     // isCollect
     @Column({ default: false }) IS_COLLECT: boolean;
     // isDrafts
    @Column({ default: false }) ID_DRAFTS: boolean;
    // publishTime
    @Column() CREATED: string;
    // STATE
    @Column({ default: 1}) STATE: number;

    @OneToOne(type => BbsPostList, post => post.acticles)
    post: BbsPostList[];

    @OneToMany(type => BbsCommentsList, comment => comment.posts)
    comments: BbsCommentsList[];
}
