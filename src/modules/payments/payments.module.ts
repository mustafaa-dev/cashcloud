import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { DatabaseModule } from '@app/common';
import { Payment } from './entities';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [DatabaseModule.forFeature([Payment])],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository],
})
export class PaymentsModule {}
