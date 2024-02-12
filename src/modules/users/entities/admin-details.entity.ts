import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Payment } from '@app/payments';

@Entity('admin_details')
export class AdminDetails extends AbstractEntity<AdminDetails> {
  @Column()
  is_super_admin: boolean;
  @OneToMany(() => Payment, (payment) => payment.admin)
  payments: Payment[];
}
