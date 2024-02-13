import { Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CityRepository } from './repositories/city.repository';

@Module({
  // imports: [DatabaseModule.forFeature([City])],
  controllers: [CitiesController],
  providers: [CitiesService, CityRepository],
})
export class CitiesModule {}
