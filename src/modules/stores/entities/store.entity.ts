import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './../../../../libs/common/src/modules/database/entities/abstract.entity';
import { StoreType } from '../modules/store-types/entites/store-types.entity';
import { Address } from '../../addresses/entities/address.entity';
import { License } from '@app/license/entities/license.entity';

@Entity('stores')
export class Store extends AbstractEntity<Store> {
  @Column()
  name: string;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

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

  // @ManyToMany(() => License)
  // @JoinTable()
  // owned_by: License;

  @ManyToOne(() => License, (license) => license.stores)
  owned_by: License;
  @ManyToOne(() => StoreType, (storeType) => storeType.stores, { eager: true })
  store_type: StoreType;
}
