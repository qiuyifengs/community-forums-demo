import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { ArticleDetail } from './articleDetail.entity';
import { ChildrenComments } from './childrenComment.entity';
@Entity()
export class CommentsList {
    @PrimaryGeneratedColumn() serialNum: number;

    // usreId
    @Column() userId: string;

    // commentUserName
    @Column() commentUserName: string;

    // commentatorId
    @Column() commentatorId: string;

    // commentatorName
    @Column() commentatorName: string;

    // articleTitle
    @Column() articleTitle: string;

    // articleId
    @Column() articleId: string;

    // commentId
    @Column() commentId: string;

    // commentContent
    @Column() commentContent: string;

    // commentTime
    @Column() commentTime: string;

    @ManyToOne(type => ArticleDetail, post => post.comments)
    posts: ArticleDetail;

    @OneToMany(type => ChildrenComments, children => children.childrens)
    childrenComentList: ChildrenComments[];
}
