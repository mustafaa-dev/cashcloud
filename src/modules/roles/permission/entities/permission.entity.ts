import { Column, Entity } from 'typeorm';
// import { AbstractEntity } from '@app/common'; //can't reach @/app/common
import { AbstractEntity } from '@app/common/modules/database/entities/abstract.entity'; // works

@Entity('permissions')
export class Permission extends AbstractEntity<Permission> {
  @Column()
  name: string;
}
