import { AggregateRoot } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm';
import { EntityRepository } from './entity.repository';

import { BaseEntity } from './identifiable-entity.schema';

export abstract class BaseEntityRepository<
  TSchema extends BaseEntity,
  TEntity extends AggregateRoot,
> extends EntityRepository<TSchema, TEntity> {
  async findOneById(id: string): Promise<TEntity> {
    return this.findOne({ id } as FindOptionsWhere<TSchema>);
  }

  async findOneAndReplaceById(id: string, entity: TEntity): Promise<void> {
    await this.findOneAndReplace({ id } as FindOptionsWhere<TSchema>, entity);
  }

  async findAll(): Promise<TEntity[]> {
    return this.find({});
  }
}
