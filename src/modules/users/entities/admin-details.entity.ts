import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common';

@Entity('admin_details')
export class AdminDetails extends AbstractEntity<AdminDetails> {
  @Column()
  is_super_admin: boolean;
}
