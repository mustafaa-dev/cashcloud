import { BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
  @Column({ type: 'timestamp', default: 'null' })
  deletedAt?: Date;

  @BeforeUpdate()
  updateDate() {
    this.updatedAt = new Date();
  }
}
