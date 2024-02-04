import { AbstractEntity } from '../../../../libs/common/src/database/entities/abstract.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { Picture } from '../../media/entities/picture.entity';
import { Role } from '../../roles/entities/role.entity';

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

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  code: number;

  @Column({ nullable: true })
  codeExpiration: Date;

  @OneToOne(() => Picture, { eager: true })
  @JoinColumn()
  picture: Picture;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;
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

  // @OneToOne(() => PasswordReset, (pr) => pr.user)
  // @JoinColumn()
  // password_reset: PasswordReset;
  @BeforeInsert()
  async saving() {
    this.password = await hash(this.password, 10);
  }
}
