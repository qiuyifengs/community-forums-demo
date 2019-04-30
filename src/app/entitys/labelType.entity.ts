import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BbsLabelList } from './labelList.entity';

@Entity()
export class BbsLabelType {
  @PrimaryGeneratedColumn() ID: number;

  @Column({ length: 20 }) TYPE_NAME_EN: string;

  @Column({ length: 20 }) TYPE_NAME_CN: string;

  @Column() TYPE_ID: string;

  @Column({ default: 'zh_CN' }) LANGUE: string;

  @Column({ default: 1 }) STATE: number;

  @Column() CREATED: string;

  @OneToMany(type => BbsLabelList, children => children.labelList)
    labelArr: BbsLabelList[];
}
