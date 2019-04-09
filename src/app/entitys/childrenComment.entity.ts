import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { CommentsList } from './commentList.entity';
@Entity()
export class ChildrenComments {
    @PrimaryGeneratedColumn() serialNum: number;
    // usreId
    @Column() userId: string;

    // commentator
    @Column() commentator: string;

    // articleId
    @Column() articleId: string;

    // commentUserName
    @Column() commentUserName: string;
    // commentId
    @Column() commentId: string;

    // childCommentId
    @Column() childCommentId: string;

    // commentContent
    @Column() commentContent: string;

    // commentTime
    @Column() commentTime: string;

    @ManyToOne(type => CommentsList, parent => parent.childrenComentList)
    childrens: CommentsList;

}
