import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
@Entity()
export class BbsMyCollectionList {
    @PrimaryGeneratedColumn() ID: number;
    // userId
    @Column() USER_ID: string;

    // author
    @Column() AUTHOR: string;

    // authorId
    @Column() AUTHOR_ID: string;

    // articleId
    @Column() ARTICLE_ID: string;

    // title
    @Column() ARTICLE_TITLE: string;

    // articleContent
    @Column({ length: 12000 }) ARTICLE_CONTENT: string;

    // articleLabel
    @Column() ARTICLE_LABEL: string;

    // articleType
    @Column() ARTICLE_TYPE: string;

    // viewCount
    @Column({ default: 0 }) VIEW_COUNT: number;

    // collectCount
    @Column({ default: 0 }) COLLECT_COUNT: number;

    // likeCount
    @Column({ default: 0 }) LIKE_COUNT: number;

    // commentCoun
    @Column({ default: 0 }) COMMENT_COUNT: number;

    // isLike
    // @Column({ default: false }) IS_LIKE: boolean;

    // isCollect
    @Column({ default: false }) IS_COLLECT: boolean;

    @Column({ default: 1 }) STATE: number;

    // publishTime
    @Column() CREATED: string;

}
