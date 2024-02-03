import { AbstractEntity } from '@app/common';
import { BeforeInsert, Column } from 'typeorm';
import { hash } from 'bcryptjs';

export class AbstractUserEntity extends AbstractEntity<AbstractUserEntity> {
  @Column()
  name: string;
  @Column()
  password: string;
  @Column({ unique: true })
  email: string;
  @Column({ default: false })
  verified: boolean;
  @Column({ nullable: true })
  code: number;
  @Column({ nullable: true })
  codeExpiration: Date;

  @BeforeInsert()
  async saving() {
    this.password = await hash(this.password, 10);
  }
}
