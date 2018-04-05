import { schema } from 'normalizr';
import { Diagram } from '../interfaces';

export interface NormalizedDiagrams {
  entities: { [key: string]: Diagram };
  ids: string[];
}

export const diagramSchema = new schema.Entity(
  'diagrams',
  {},
  { idAttribute: 'uuid' },
);

export const diagramsSchema = new schema.Object({
  // tslint:disable-next-line:prefer-array-literal
  diagrams: new schema.Array(diagramSchema),
});
