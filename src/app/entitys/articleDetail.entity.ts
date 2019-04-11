import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { PostList } from './postList.entity';
import { CommentsList } from './commentList.entity';
@Entity()
export class ArticleDetail {
    @PrimaryGeneratedColumn() serialNum: number;
    // userId
    @Column() userId: string;
    // title
    @Column() articleTitle: string;
    // articleId
    @Column() articleId: string;
    // articleContent
    @Column({length: 12000}) articleContent: string;
    // articleSource
    @Column() articleType: string;
    // articleLabel
    @Column() articleLabel: string;
    // author
    @Column() author: string;
    // commentId
    @Column({ default: null }) commentId: string;
    // viewCount
    @Column({ default: 0 }) viewCount: number;
    // collectCount
    @Column({ default: 0 }) collectCount: number;
    // likeCount
    @Column({ default: 0 }) likeCount: number;
    // commentCount
    @Column({ default: 0 }) commentCount: number;
     // isLike
     @Column({ default: false }) isLike: boolean;
     // isCollect
     @Column({ default: false }) isCollect: boolean;
     // isDrafts
    @Column({ default: false }) isDrafts: boolean;
    // publishTime
    @Column() publishTime: string;

    @OneToOne(type => PostList, post => post.acticles)
    post: PostList[];

    @OneToMany(type => CommentsList, comment => comment.posts)
    comments: CommentsList[];
}
