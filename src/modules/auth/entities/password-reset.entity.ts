import { AbstractEntity } from '../../../../libs/common/src/modules/database/entities/abstract.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { addMinutes } from 'date-fns';
import { User } from '../../users/entities/user.entity';

@Entity('Password_Reset')
export class PasswordReset extends AbstractEntity<PasswordReset> {
  @Column()
  passwordResetToken: string;

  @Column()
  passwordResetExpiration: Date;

  @OneToOne(() => User, { nullable: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  add() {
    this.passwordResetExpiration = addMinutes(new Date(), 10);
  }
}
