import { BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractTrEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  language: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @BeforeUpdate()
  updateDate() {
    this.updatedAt = new Date();
  }
}
