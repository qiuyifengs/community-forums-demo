import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ArticleDetail } from './articleDetail.entity';
import { CommentsList } from './commentList.entity';
@Entity()
export class PostList {
    @PrimaryGeneratedColumn() serialNum: number;
    // userId
    @Column() userId: string;
    // title
    @Column() articleTitle: string;
    // articleId
    @Column() articleId: string;
    // articleSource
    @Column() articleType: string;
    // articleLabel
    @Column() articleLabel: string;
    // content
    @Column({ length: 12000 }) articleContent: string;
    // author
    @Column() author: string;
    // viewCount
    @Column({ default: 0 }) viewCount: number;
    // collectCount
    @Column({ default: 0 }) collectCount: number;
    // likeCount
    @Column({ default: 0 }) likeCount: number;
    // commentCount
    @Column({ default: 0 }) commentCount: number;
    // isDrafts
    @Column({ default: false }) isDrafts: boolean;
    // publishTime
    @Column() publishTime: string;
    // editTime
    @Column() editTime: string;
    // editPerson
    @Column() editPerson: string;

    @OneToOne(type => ArticleDetail, acticle => acticle.post, {
        cascade: true,
    })
    acticles: ArticleDetail;

}
