import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common';

@Entity('cities')
export class City extends AbstractEntity<City> {
  @Column()
  name: string;
  @Column()
  government: string;
  @Column()
  slug: string;
  // @OneToMany(() => Store, (store) => store.city, { nullable: true })
  // stores: Store[];
  @Column()
  latitude: string;
  @Column()
  longitude: string;
}
