import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';


export enum TransactionStatus {
  inFlow = 'In Flow',
  outFlow = 'Out Flow',
}

@Entity('transactions')
export class TransactionEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: string

  @Column()
  ref: string

  @Column()
  description: string

  @Column({default: null})
  from: string

  @Column({default: null})
  to: string

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  user: UserEntity

  @Column({default: TransactionStatus.inFlow})
  status: TransactionStatus

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  created: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated: Date;

}
