import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
@Entity()
export class MyCollectionList {
    @PrimaryGeneratedColumn() serialNum: number;
    // userId
    @Column() userId: string;

    // author
    @Column() author: string;

    // authorId
    @Column() authorId: string;

    // articleId
    @Column() articleId: string;

    // title
    @Column() articleTitle: string;

    // articleContent
    @Column({ length: 12000 }) articleContent: string;

    // articleLabel
    @Column() articleLabel: string;

    // articleSource
    @Column() articleType: string;

    // viewCount
    @Column({ default: 0 }) viewCount: number;

    // collectCount
    @Column({ default: 0 }) collectCount: number;

    // likeCount
    @Column({ default: 0 }) likeCount: number;

    // commentCoun
    @Column({ default: 0 }) commentCount: number;

    // isLike
    @Column({ default: false }) isLike: boolean;
    // isCollect
    @Column({ default: false }) isCollect: boolean;

    // publishTime
    @Column() publishTime: string;

}
