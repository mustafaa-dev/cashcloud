import { AbstractEntity } from '@app/common';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<
  TEntity extends AbstractEntity<TEntity>,
> {
  protected constructor(
    private readonly entityRepository: Repository<TEntity>,
    private readonly entityManager: EntityManager,
    private notFoundMsg: string,
  ) {}

  async create(entity: TEntity): Promise<TEntity> {
    return await this.entityManager.save(entity);
  }

  async findOne(where: object): Promise<TEntity> {
    const entity = await this.entityRepository.findOne(where);
    if (!entity) throw new NotFoundException(this.notFoundMsg);
    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<TEntity>,
    update: QueryDeepPartialEntity<TEntity>,
  ) {
    const entity = await this.entityRepository.findOne({ where });
    if (!entity) throw new NotFoundException('Not found');
    Object.assign(entity, update);
    return await this.entityRepository.save(entity);
  }

  async find(where: FindOptionsWhere<TEntity>) {
    return await this.entityRepository.find({ where });
  }

  async findOneAndDelete(where: FindOptionsWhere<TEntity>) {
    const { affected } = await this.entityRepository.delete(where);
    if (affected <= 0)
      throw new NotFoundException('Error While Deleting , Not found');
    return;
  }

  async checkOne(where: FindOptionsWhere<TEntity>) {
    return await this.entityRepository.findOneBy(where);
  }
}
