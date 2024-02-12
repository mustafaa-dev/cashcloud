import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { City } from '../modules/cities/entities/city.entity';
import { StoreType } from '../modules/store-types/entites/store-types.entity';
import { Address } from '../../addresses/entities/address.entity';
import { License } from '@app/license/entities/license.entity';

@Entity('stores')
export class Store extends AbstractEntity<Store> {
  @Column()
  name: string;

  @ManyToMany(() => Address)
  @JoinTable()
  address: Address[];

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ default: false })
  active: boolean;

  @Column({
    default:
      'https://res.cloudinary.com/dp2f96bxe/image/upload/v1689102715/Logo_horiz_72ppi_k1jppp.png',
  })
  logo: string;

  @ManyToOne(() => City, (city) => city.stores)
  city: City;
  @ManyToMany(() => License)
  @JoinTable()
  owned_by: License;
  @ManyToOne(() => StoreType, (storeType) => storeType.stores)
  store_type: StoreType;
}
