import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BbsLabelType } from './labelType.entity';

@Entity()
export class BbsLabelList {
  @PrimaryGeneratedColumn() ID: number;

  @Column({ length: 20 }) LABEL_NAME: string;

  @Column() TYPE_ID: string;

  @Column() LABEL_ID: string;

  @Column({ default: 1 }) STATE: number;

  @Column() CREATED: string;

  @ManyToOne(type => BbsLabelType, parent => parent.labelArr)
  labelList: BbsLabelType;
}
