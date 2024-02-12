import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { License } from '@app/license/entities/license.entity';

@Entity('client_details')
export class ClientDetails extends AbstractEntity<ClientDetails> {
  @OneToOne(() => License, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  license: License;
}
