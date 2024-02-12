import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { AdminDetails } from '@app/users';
import { License } from '@app/license/entities/license.entity';

@Entity('payments')
export class Payment extends AbstractEntity<Payment> {
  @ManyToOne(() => AdminDetails, (admin: AdminDetails) => admin.payments, {
    cascade: true,
  })
  admin: AdminDetails;

  @ManyToMany(() => License, {
    cascade: true,
  })
  @JoinTable()
  for: License;

  @Column()
  total: number;
}
