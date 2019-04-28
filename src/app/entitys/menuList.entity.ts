import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn() serialNum: number;
  @Column() menuEn: string;
  @Column() menuCn: string;
  @Column() menuId: string;
  @Column({ default: true }) isType: boolean;
  @Column({ default: 'cn' }) langue: string;
}
