import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LabelType } from './labelType.entity';

@Entity()
export class LabelList {
  @PrimaryGeneratedColumn() ID: number;

  @Column({ length: 20 }) LABEL_NAME: string;

  @Column() TYPE_ID: string;

  @Column() LABEL_ID: string;

  @ManyToOne(type => LabelType, parent => parent.labelArr)
  labelList: LabelType;
}
