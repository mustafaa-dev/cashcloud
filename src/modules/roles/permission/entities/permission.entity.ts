import { Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/modules/database/entities/abstract.entity';
import { PermissionTranslation } from '@app/roles/permission/entities/permissions-tr.entity';

@Entity('permissions')
export class Permission extends AbstractEntity<Permission> {
  @OneToMany(
    () => PermissionTranslation,
    (translation) => translation.permission,
  )
  translations: PermissionTranslation[];
}
