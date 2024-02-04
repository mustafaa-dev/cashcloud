import { BeforeInsert, Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common';

@Entity('verification')
export class Verification extends AbstractEntity<Verification> {
  @Column()
  code: number;

  @Column()
  codeExpiration: Date;

  @BeforeInsert()
  addExpirationDate() {
    this.codeExpiration = new Date();
  }
}
