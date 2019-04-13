import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { CommentsList } from './commentList.entity';
@Entity()
export class ChildrenComments {
    @PrimaryGeneratedColumn() serialNum: number;
    // usreId
    @Column() userId: string;

    // commentUserName
    @Column() commentUserName: string;

    @Column() author: string;

    // commentatorId
    @Column() commentatorId: string;

    // commentatorName
    @Column() commentatorName: string;

    // commentId
    @Column() commentId: string;

    // childCommentId
    @Column() childCommentId: string;

    // articleId
    @Column() articleId: string;

    // commentContent
    @Column() commentContent: string;

    // commentTime
    @Column() commentTime: string;

    @ManyToOne(type => CommentsList, parent => parent.childrenComentList)
    childrens: CommentsList;

}
