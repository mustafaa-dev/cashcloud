import { AbstractRepository } from '@app/common';
import { Payment } from '../entities/payment.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class PaymentRepository extends AbstractRepository<Payment> {
  constructor(
    @InjectRepository(Payment) repository: Repository<Payment>,
    entityManager: EntityManager,
  ) {
    super(repository, entityManager, 'Payment Info not found');
  }
}
