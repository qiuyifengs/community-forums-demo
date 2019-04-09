import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn() serialNum: number;
  @Column() menu: string;
  @Column() menuId: string;
  @Column({ default: true }) isType: boolean;
  @Column({ default: 'ch' }) langue: string;
}
