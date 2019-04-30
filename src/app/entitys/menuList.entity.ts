import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BbsMenu {
  @PrimaryGeneratedColumn() ID: number;
  @Column() MENU_EN: string;
  @Column() MENU_CN: string;
  @Column() MENU_ID: string;
  @Column({ default: true }) IS_TYPE: boolean;
  @Column({ default: 'zh_CN' }) LANGUE: string;
  @Column({ default: 1 }) STATE: number;
  @Column() CREATED: string;
}
