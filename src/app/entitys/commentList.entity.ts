import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { ArticleDetail } from './articleDetail.entity';
import { BbsChildrenComments } from './childrenComment.entity';
@Entity()
export class BbsCommentsList {
    @PrimaryGeneratedColumn() ID: number;

    // usreId
    @Column() USER_ID: string;

    // commentUserName
    @Column() COMMENT_USER_NAME: string;

    // commentatorId
    @Column() COMMENTATOR_ID: string;

    // commentatorName
    @Column() COMMENTATOR_NAME: string;

    // articleTitle
    @Column() ARTICLE_TITLE: string;

    // articleId
    @Column() ARTICLE_ID: string;

    // commentId
    @Column() COMMENT_ID: string;

    // commentContent
    @Column() COMMENT_CONTENT: string;

    // commentTime
    @Column() CREATED: string;

    @ManyToOne(type => ArticleDetail, post => post.comments)
    posts: ArticleDetail;

    @OneToMany(type => BbsChildrenComments, children => children.childrens)
    childrenComentList: BbsChildrenComments[];
}
