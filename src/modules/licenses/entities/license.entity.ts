import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/modules/database/entities/abstract.entity';
import { Store } from '@app/stores/entities';
import { Payment } from '@app/payments/entities/';

@Entity('licenses')
export class License extends AbstractEntity<License> {
  @Column()
  code: number;
  @Column()
  active: boolean;
  @Column()
  expiresAt: Date;
  @Column()
  no_of_stores: number;

  @OneToMany(() => Store, (store) => store.owned_by, { eager: true })
  stores: Store[];

  @OneToMany(() => Payment, (payment) => payment.license)
  paid: Payment[];
}
