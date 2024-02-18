import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from '@app/common/modules/database/entities/abstract.entity';
import { StoreType } from '../modules/store-types/entites/store-types.entity';
import { Address } from '../../addresses/entities/address.entity';
import { License } from '@app/license/entities/license.entity';
import { Picture } from '@app/media/entities';
import { Product } from '@app/modules/products/entities/product.entity';

@Entity('stores')
export class Store extends AbstractEntity<Store> {
  @Column()
  name: string;

  @OneToOne(() => Address, { eager: true })
  @JoinColumn()
  address: Address;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ default: false })
  active: boolean;

  @OneToOne(() => Picture, { eager: true })
  @JoinColumn()
  logo: Picture;

  @ManyToOne(() => License, (license) => license.stores)
  owned_by: License;
  @ManyToOne(() => StoreType, (storeType) => storeType.stores, { eager: true })
  store_type: StoreType;
  @OneToMany(() => Product, (product) => product.store)
  products: Product[];
}
