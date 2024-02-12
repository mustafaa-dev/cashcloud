import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Store } from '../../../entities/store.entity';

@Entity('cities')
export class City extends AbstractEntity<City> {
  @Column()
  name: string;
  @Column()
  government: string;
  @Column()
  slug: string;
  @OneToMany(() => Store, (store) => store.city, { nullable: true })
  stores: Store[];
  @Column()
  latitude: string;
  @Column()
  longitude: string;
}
