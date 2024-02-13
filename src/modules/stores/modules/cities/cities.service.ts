import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CityRepository } from './repositories/city.repository';
import axios from 'axios';
import { City } from './entities/city.entity';
import { generateSlug } from '@app/common/utils/generateSlug';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class CitiesService {
  constructor(private readonly cityRepository: CityRepository) {}

  async addCity({ city, government }: any) {
    if (
      await this.cityRepository.checkOne({
        name: city.toLowerCase(),
        government: government.toLowerCase(),
      })
    )
      throw new BadRequestException('Already Added');
    const { lat, lon } = await this.getCityInfo(
      `${encodeURIComponent(city)},${encodeURIComponent(government)},Egypt`,
    );

    const newCity: City = new City();
    Object.assign(newCity, {
      name: city.toLowerCase(),
      government: government.toLowerCase(),
      slug: await generateSlug(city),
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    });
    return await this.cityRepository.createOne(newCity);
  }

  async getCityBy(options: QueryDeepPartialEntity<City>) {
    return await this.cityRepository.findOne({ where: { options } });
  }

  async getCityInfo(city: string) {
    const url: string = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
    const response = await axios.get(url);
    if (!response.data || response.data.length <= 0)
      throw new NotFoundException('City Not Found');
    const { lat, lon } = response.data[0];
    return { lat, lon };
  }
}
