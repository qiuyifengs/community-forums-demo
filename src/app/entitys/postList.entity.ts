import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ArticleDetail } from './articleDetail.entity';
@Entity()
export class PostList {
    @PrimaryGeneratedColumn() ID: number;
    // userId
    @Column() USER_ID: string;
    // title
    @Column() ARTICLE_TITLE: string;
    // articleId
    @Column() ARTICLE_ID: string;
    // articleType
    @Column() ARTICLE_TYPE: string;
    // articleLabel
    @Column() ARTICLE_LABEL: string;
    // content
    @Column({ length: 12000 }) ARTICLE_CONTENT: string;
    // author
    @Column() AUTHOR: string;
    // viewCount
    @Column({ default: 0 }) VIEW_COUNT: number;
    // collectCount
    @Column({ default: 0 }) COLLECT_COIUNT: number;
    // likeCount
    @Column({ default: 0 }) LIKE_COUNT: number;
    // commentCount
    @Column({ default: 0 }) COMMENT_COUNT: number;
    // isDrafts
    @Column({ default: false }) IS_DRAFTS: boolean;
    // top
    @Column({default: false }) TOP: boolean;
    // publishTime
    @Column() PUBLISH_TIME: string;
    // editTime
    @Column() EDIT_TIME: string;
    // editPerson
    @Column() EDIT_PERSON: string;

    @OneToOne(type => ArticleDetail, acticle => acticle.post, {
        cascade: true,
    })
    acticles: ArticleDetail;

}
