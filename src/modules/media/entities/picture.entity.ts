import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../../libs/common/src/modules/database/entities/abstract.entity';

@Entity('pictures')
export class Picture extends AbstractEntity<Picture> {
  @Column()
  originalname: string;
  @Column()
  secure_url: string;
  @Column({ type: 'text' })
  delete_token: string;
  @Column()
  format: string;
  @Column()
  bytes: string;
  @Column()
  public_id: string;
  @Column()
  width: number;
  @Column()
  height: number;
}
