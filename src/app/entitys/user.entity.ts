import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BbsUser {
    @PrimaryGeneratedColumn() ID: number;
    // token
    @Column({ default: null }) TOKEN: string;
    // autotoken
    // @Column({default: 500}) autotoken: string;
    // userId
    @Column({ length: 20 }) USER_ID: string;
    // passWord
    @Column() PASSWORD: string;
    // nickName
    @Column() NICK_NAME: string;
    // eamil
    @Column() EMAIL: string;
    // headerIcon
    @Column({ default: null }) HEADER_ICON: string;
    // personalProfile
    @Column({ default: '这个人很懒！' }) PERSONAL_PROFILE: string;
    // tel
    @Column({ default: '0' }) TEL: string;
    // focusCount
    @Column({ default: 0 }) FOCUS_COUNT: number;
    // articleCount
    @Column({ default: 0 }) ARTICLE_COUNT: number;
    // hadNews
    @Column({ default: false }) HAD_NEWS: boolean;
    // registerdate
    @Column() CREATED: string;
    // STATE
    @Column({ default: 1 }) STATE: number;
    // activity
    @Column({ default: true }) ACTIVITY: boolean;
}
