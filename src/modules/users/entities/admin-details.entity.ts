import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './../../../../libs/common/src/modules/database/entities/abstract.entity';
import { Payment } from '@app/payments/entities';

@Entity('admin_details')
export class AdminDetails extends AbstractEntity<AdminDetails> {
  @Column()
  is_super_admin: boolean;
  @OneToMany(() => Payment, (payment) => payment.admin)
  payments: Payment[];
}
