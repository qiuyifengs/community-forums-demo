import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LabelList } from './labelList.entity';

@Entity()
export class LabelType {
  @PrimaryGeneratedColumn() ID: number;

  @Column({ length: 20 }) TYPE_NAME_EN: string;

  @Column({ length: 20 }) TYPE_NAME_CN: string;

  @Column() TYPE_ID: string;

  @Column({ default: 'zh_CN' }) LANGUE: string;

  @OneToMany(type => LabelList, children => children.labelList)
    labelArr: LabelList[];
}
