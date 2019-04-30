import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BbsCommentsList } from './commentList.entity';
@Entity()
export class BbsChildrenComments {
    @PrimaryGeneratedColumn() ID: number;
    // usreId
    @Column() USER_ID: string;

    // commentUserName
    @Column() COMMENT_USER_NAME: string;

    // commentatorId
    @Column() COMMENTATOR_ID: string;

    // commentatorName
    @Column() COMMENTATOR_NAME: string;

    // commentId
    @Column() COMMENT_ID: string;

    // childCommentId
    @Column() CHILD_COMMENT_ID: string;

    @Column() AUTHOR: string;

    // authorId
    @Column() AUTHOR_ID: string;

    // articleId
    @Column() ARTICLE_ID: string;

    // commentContent
    @Column() COMMENT_CONTENT: string;

    // commentTime
    @Column() CREATED: string;

    // state
    @Column({default: 1}) STATE: number;

    @ManyToOne(type => BbsCommentsList, parent => parent.childrenComentList)
    childrens: BbsCommentsList;

}
