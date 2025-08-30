import { AggregateRoot } from '@nestjs/cqrs';

import { BaseEntity } from './identifiable-entity.schema';

export interface EntitySchemaFactory<
  TSchema extends BaseEntity,
  TEntity extends AggregateRoot,
> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
