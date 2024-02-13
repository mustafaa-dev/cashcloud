import { Body, Controller, Post } from '@nestjs/common';
import { CitiesService } from './cities.service';

// import { AddCityDto } from '@app/common';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  async addCity(@Body() addCityDto: any) {
    return await this.citiesService.addCity(addCityDto);
  }
}
