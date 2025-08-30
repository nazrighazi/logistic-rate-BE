import { NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { Repository, FindOptionsWhere } from 'typeorm';

import { EntitySchemaFactory } from './entity-schema.factory';
import { BaseEntity } from './identifiable-entity.schema';

export abstract class EntityRepository<
  TSchema extends BaseEntity,
  TEntity extends AggregateRoot,
> {
  constructor(
    protected readonly entityRepository: Repository<TSchema>,
    protected readonly entitySchemaFactory: EntitySchemaFactory<
      TSchema,
      TEntity
    >,
  ) {}

  protected async findOne(
    entityFilterQuery?: FindOptionsWhere<TSchema>,
  ): Promise<TEntity> {
    const entityDocument = await this.entityRepository.findOne({
      where: entityFilterQuery,
    });

    if (!entityDocument) {
      throw new NotFoundException('Entity was not found.');
    }

    return this.entitySchemaFactory.createFromSchema(entityDocument);
  }

  protected async find(
    entityFilterQuery?: FindOptionsWhere<TSchema>,
  ): Promise<TEntity[]> {
    const entityDocuments = await this.entityRepository.find({
      where: entityFilterQuery,
    });

    return entityDocuments.map((entityDocument) =>
      this.entitySchemaFactory.createFromSchema(entityDocument),
    );
  }

  async create(entity: TEntity): Promise<void> {
    const entitySchema = this.entitySchemaFactory.create(entity);
    await this.entityRepository.save(entitySchema);
  }

  protected async findOneAndReplace(
    entityFilterQuery: FindOptionsWhere<TSchema>,
    entity: TEntity,
  ): Promise<void> {
    const existingEntity = await this.entityRepository.findOne({
      where: entityFilterQuery,
    });

    if (!existingEntity) {
      throw new NotFoundException('Unable to find the entity to replace.');
    }

    const entitySchema = this.entitySchemaFactory.create(entity);
    await this.entityRepository.save({
      ...entitySchema,
      id: existingEntity.id,
    });
  }
}
