import { Column, Entity } from 'typeorm';
import { AbstractUserEntity } from './abstract-user.entity';

@Entity('admin')
export class AdminEntity extends AbstractUserEntity {
  @Column()
  isSuperAdmin: boolean;
}
