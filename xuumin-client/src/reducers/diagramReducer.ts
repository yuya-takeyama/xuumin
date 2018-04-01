import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Diagram } from '../interfaces';
import { fetchDiagrams, fetchDiagram } from '../actions/diagramActions';

export interface State {
  entities: { [key: string]: Diagram };
  ids: string[];
  isFetchingDiagrams: boolean;
  isFetchingDiagram: boolean;
  error?: Error;
}

export const createInitialState = (): State => ({
  entities: {},
  ids: [],
  isFetchingDiagrams: false,
  isFetchingDiagram: false,
});

export const diagramReducer = reducerWithInitialState(createInitialState())
  .case(fetchDiagrams.started, state => ({
    ...state,
    isFetchingDiagrams: true,
  }))
  .caseWithAction(fetchDiagrams.done, (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload.result.entities,
    },
    ids: action.payload.result.ids,
    isFetchingDiagrams: false,
  }))
  .caseWithAction(fetchDiagrams.failed, (state, action) => ({
    ...state,
    isFetchingDiagrams: false,
    error: action.payload.error,
  }))
  .case(fetchDiagram.started, state => ({
    ...state,
    isFetchingDiagram: true,
  }))
  .caseWithAction(fetchDiagram.done, (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      [action.payload.params.uuid]: action.payload.result,
    },
    isFetchingDiagram: false,
  }))
  .caseWithAction(fetchDiagram.failed, (state, action) => ({
    ...state,
    isFetchingDiagram: false,
    error: action.payload.error,
  }));
