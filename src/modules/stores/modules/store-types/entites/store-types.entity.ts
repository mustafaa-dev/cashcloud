import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Store } from '@app/stores/entities';

@Entity('store_types')
export class StoreType extends AbstractEntity<StoreType> {
  @Column()
  name: string;

  @Column()
  cost: number;

  @OneToMany(() => Store, (store) => store.store_type)
  stores: Store[];
}
