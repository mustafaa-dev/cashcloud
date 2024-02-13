import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './../../../../libs/common/src/modules/database/entities/abstract.entity';
import { AdminDetails } from '@app/users/entities';
import { License } from '@app/license/entities';

@Entity('payments')
export class Payment extends AbstractEntity<Payment> {
  @ManyToOne(() => AdminDetails, (admin: AdminDetails) => admin.payments, {
    cascade: true,
  })
  admin: AdminDetails;

  @ManyToOne(() => License, (license: License) => license.paid, {
    eager: true,
  })
  license: License;

  @Column()
  total: number;
}
