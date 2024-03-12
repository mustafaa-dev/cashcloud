import { Entity, ManyToOne } from 'typeorm';
import { AbstractTrEntity } from '@app/common';
import { Permission } from '@app/roles/permission/entities/permission.entity';

@Entity('permissions_translations')
export class PermissionTranslation extends AbstractTrEntity<PermissionTranslation> {
  @ManyToOne(() => Permission, (permission) => permission.translations)
  permission: Permission;
}
