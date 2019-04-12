import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LabelList } from './labelList.entity';

@Entity()
export class LabelType {
  @PrimaryGeneratedColumn() serialNum: number;

  @Column({ length: 20 }) typeName: string;

  @Column() typeId: string;

  @OneToMany(type => LabelList, children => children.labelList)
    labelArr: LabelList[];
}
