import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Picture } from '../entities/picture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PictureRepository extends AbstractRepository<Picture> {
  constructor(
    @InjectRepository(Picture) pictureRepository: Repository<Picture>,
    entityManager: EntityManager,
  ) {
    super(pictureRepository, entityManager, 'Picture Not Found');
  }
}
