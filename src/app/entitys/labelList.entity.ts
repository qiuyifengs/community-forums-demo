import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LabelType } from './labelType.entity';

@Entity()
export class LabelList {
  @PrimaryGeneratedColumn() serialNum: number;

  @Column({ length: 20 }) labelName: string;

  @Column() typeId: string;

  @Column() labelId: string;

  @ManyToOne(type => LabelType, parent => parent.labelArr)
  labelList: LabelType;
}
