import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Store } from '@app/stores';

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
  @OneToMany(() => Store, (store) => store.license)
  stores: Store[];
}
