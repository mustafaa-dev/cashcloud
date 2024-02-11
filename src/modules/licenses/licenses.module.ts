import { Module } from '@nestjs/common';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { DatabaseModule } from '@app/common';
import { License } from './entities';
import { LicenseRepository } from './repositories';

@Module({
  imports: [DatabaseModule.forFeature([License])],
  controllers: [LicensesController],
  providers: [LicensesService, LicenseRepository],
  exports: [LicensesService],
})
export class LicensesModule {}
