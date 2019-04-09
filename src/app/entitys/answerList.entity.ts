import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
@Entity()
export class AnswerList {
    @PrimaryGeneratedColumn() serialNum: number;
    // userId
    @Column() userId: string;

    // articleId
    @Column() articleId: string;

    // articleTitle
    @Column() articleTitle: string;

    // commentUserName
    @Column() commentUserName: string;

    // commentId
    @Column() commentId: string;

    // commentUserIcon
    @Column() commentUserIcon: string;

    // commentContent
    @Column() commentContent: string;

    // commentTime
    @Column() commentTime: string;

}
