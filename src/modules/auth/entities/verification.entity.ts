import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../../libs/common/src/modules/database/entities/abstract.entity';
import { addMinutes } from 'date-fns';
import { User } from '../../users/entities/user.entity';

@Entity('verification')
export class Verification extends AbstractEntity<Verification> {
  @Column()
  code: number;

  @Column()
  codeExpiration: Date;

  @OneToOne(() => User, { nullable: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  addExpirationDate() {
    this.codeExpiration = addMinutes(new Date(), 10);
  }
}
