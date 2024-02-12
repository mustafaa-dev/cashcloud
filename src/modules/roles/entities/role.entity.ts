import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Permission } from '@app/roles/permission/entities';
import { User } from '@app/users';

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
