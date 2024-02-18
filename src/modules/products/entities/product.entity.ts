import { AbstractEntity } from '@app/common/modules/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Picture } from '@app/media/entities';
import { Store } from '@app/stores/entities';

@Entity({ name: 'products' })
export class Product extends AbstractEntity<Product> {
  @Column()
  name: string;
  @Column({ unique: true, type: 'bigint' })
  code: number;
  @OneToOne(() => Picture, { eager: true })
  @JoinColumn()
  photo: Picture;
  @Column()
  quantity: number;
  @Column()
  price: number;
  @Column({ default: true })
  listed: boolean;
  @Column({ default: false })
  discount: boolean;
  @Column({ default: 0 })
  discount_value: number;
  @Column({ default: 0 })
  discount_percentage: number;
  @Column({ nullable: true, default: null })
  discount_validate: Date;
  @ManyToOne(() => Store, (store) => store.products)
  store: Store;
}
