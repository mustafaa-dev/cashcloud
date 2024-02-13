import { AbstractEntity } from './../../../../libs/common/src/modules/database/entities/abstract.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { Picture } from '@app/media/entities';
import { Role } from '@app/roles/entities';
import { ClientDetails } from './client-details.entity';
import { AdminDetails } from './admin-details.entity';

@Entity('users')
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column({ default: false })
  active: boolean;

  @OneToOne(() => Picture, { eager: true })
  @JoinColumn()
  picture: Picture;

  @ManyToOne(() => Role, (role: Role) => role.users, { eager: true })
  role: Role;

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  passwordChangedAt: Date;

  @OneToOne(() => ClientDetails, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  client_details?: ClientDetails;

  @OneToOne(() => AdminDetails, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  admin_details: AdminDetails;

  @Column({ nullable: true, default: null })
  twoFA: string;

  // @OneToMany(() => Payment, (payment) => payment.user)
  // payments: Payment[];
  //
  // @OneToOne(() => License, (license) => license.owner)
  // @JoinColumn()
  // license: License;
  //
  //
  // @OneToMany(() => Log, (log) => log.user)
  // logs: Log[];

  // @OneToOne(() => Shift, (shift) => shift.user)
  // @JoinColumn()
  // shift: Shift;

  @BeforeInsert()
  async saving() {
    this.password = await hash(this.password, 10);
  }
}
