import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/modules/database/entities/abstract.entity';
import { Permission } from '@app/roles/permission/entities';
import { User } from '@app/users/entities';
import { RolesTranslation } from '@app/roles/entities/roles-tr.entity';

@Entity('roles')
export class Role extends AbstractEntity<Role> {
  @OneToMany(() => RolesTranslation, (translation) => translation.role)
  translations: RolesTranslation[];

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  has: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
