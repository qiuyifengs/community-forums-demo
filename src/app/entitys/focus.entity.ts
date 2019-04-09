import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Focus {
  @PrimaryGeneratedColumn() serialNum: number;
  // 用户名
  @Column({ length: 20 })
  userName: string;
  // 密码
  @Column() passWord: string;
  @CreateDateColumn() date: string;
}
