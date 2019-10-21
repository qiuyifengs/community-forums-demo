import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class BbsMyLikeList {
    @PrimaryGeneratedColumn() ID: number;
    // userId
    @Column() USER_ID: string;

    // articleId
    @Column() ARTICLE_ID: string;

    // collectCount
    // @Column({ default: 0 }) COLLECT_COUNT: number;

    // likeCount
    @Column({ default: 0 }) LIKE_COUNT: number;

    // isLike
    @Column({ default: false }) IS_LIKE: boolean;

    // isCollect
    // @Column({ default: false }) IS_COLLECT: boolean;

    @Column({ default: 1 }) STATE: number;

    // created
    @Column() CREATED: string;
}
