import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common';

@Entity('licenses')
export class License extends AbstractEntity<License> {
  @Column()
  code: number;
  @Column()
  active: boolean;
  @Column()
  expiresAt: Date;
  @Column()
  no_of_stores: number;
}
