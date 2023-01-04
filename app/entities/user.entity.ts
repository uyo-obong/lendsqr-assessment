import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  account_id: string

  @Column({default: false})
  is_verify: boolean

  @Column({ default: 0 })
  wallet: number

  @Column({ default: null })
  phone_number: string;

  @Column({ default: null, unique: true })
  email: string;

  @Column({ default: 0 })
  password: string;

  @OneToMany(() => TransactionEntity, (trans) => trans.user)
  transactions: TransactionEntity

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  created: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated: Date;
}
