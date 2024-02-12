import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity('addresses')
export class Address extends AbstractEntity<Address> {
  @Column()
  address: string;
  @Column()
  city: string;
  @Column()
  government: string;
  @Column()
  latitude: string;
  @Column()
  longitude: string;
}
