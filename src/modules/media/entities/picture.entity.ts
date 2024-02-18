import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../../libs/common/src/modules/database/entities/abstract.entity';

@Entity('pictures')
export class Picture extends AbstractEntity<Picture> {
  @Column({ default: 'Cashcloud' })
  originalname: string;
  @Column({
    default:
      'https://res.cloudinary.com/dp2f96bxe/image/upload/v1689102715/Logo_horiz_72ppi_k1jppp.png',
  })
  secure_url: string;
  @Column({ type: 'text', nullable: true })
  delete_token: string;
  @Column({ default: 'image/png' })
  format: string;
  @Column({ default: '10' })
  bytes: string;
  @Column()
  public_id: string;
  @Column()
  width: number;
  @Column()
  height: number;
}
