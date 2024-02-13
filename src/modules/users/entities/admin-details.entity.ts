import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Payment } from '@app/payments/entities';

@Entity('admin_details')
export class AdminDetails extends AbstractEntity<AdminDetails> {
  @Column({ default: false })
  is_super_admin: boolean;
  @OneToMany(() => Payment, (payment) => payment.admin)
  payments: Payment[];
}
