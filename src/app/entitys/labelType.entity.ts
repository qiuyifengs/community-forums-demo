import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LabelList } from './labelList.entity';

@Entity()
export class LabelType {
  @PrimaryGeneratedColumn() serialNum: number;

  @Column({ length: 20 }) typeNameEn: string;

  @Column({ length: 20 }) typeNameCn: string;

  @Column() typeId: string;

  @Column({ default: 'cn' }) langue: string;

  @OneToMany(type => LabelList, children => children.labelList)
    labelArr: LabelList[];
}
