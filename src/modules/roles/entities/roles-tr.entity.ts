import { Entity, ManyToOne } from 'typeorm';
import { AbstractTrEntity } from '@app/common';
import { Role } from '@app/roles/entities/role.entity';

@Entity('roles_translations')
export class RolesTranslation extends AbstractTrEntity<RolesTranslation> {
  @ManyToOne(() => Role, (role) => role.translations)
  role: Role;
}
