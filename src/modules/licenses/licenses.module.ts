import { forwardRef, Module } from '@nestjs/common';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { DatabaseModule } from '@app/common';
import { License } from './entities';
import { LicenseRepository } from './repositories';
import { StoresModule } from '@app/stores';

@Module({
  imports: [
    DatabaseModule.forFeature([License]),
    forwardRef(() => StoresModule),
  ],
  controllers: [LicensesController],
  providers: [LicensesService, LicenseRepository],
  exports: [LicensesService],
})
export class LicensesModule {}
