import { schema } from 'normalizr';

export const diagramSchema = new schema.Entity(
  'diagrams',
  {},
  { idAttribute: 'uuid' },
);

export const diagramsSchema = new schema.Object({
  // tslint:disable-next-line:prefer-array-literal
  diagrams: new schema.Array(diagramSchema),
});
