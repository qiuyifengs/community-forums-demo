import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn() serialNum: number;
    // token
    @Column({ default: null }) token: string;
    // autotoken
    // @Column({default: 500}) autotoken: string;
    // userId
    @Column({ length: 20 }) userId: string;
    // passWord
    @Column() passWord: string;
    // nickName
    @Column() nickName: string;
    // eamil
    @Column() email: string;
    // headerIcon
    @Column({ default: null }) headerIcon: string;
    // personalProfile
    @Column({ default: 'aaa...' }) personalProfile: string;
    // tel
    @Column({ default: null }) tel: string;
    // focusCount
    @Column({ default: 0 }) focusCount: number;
    // articleCount
    @Column({ default: 0 }) articleCount: number;
    // registerdate
    @Column() time: string;
    // Permission
    @Column({ default: false }) activity: boolean;
    // activeToken
    @Column({ default: null }) activeToken: string;
    // activeExpires
    @Column({ default: null }) activeExpires: string;
}
