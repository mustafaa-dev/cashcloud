import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/modules/database/entities/abstract.entity';
import { Permission } from '../permission/entities/permission.entity';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Role extends AbstractEntity<Role> {
  @Column()
  name: string;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  has: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
