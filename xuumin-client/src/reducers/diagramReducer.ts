import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Diagram } from '../interfaces';
import {
  fetchDiagrams,
  fetchDiagram,
  createDiagram,
} from '../actions/diagramActions';

export interface State {
  entities: { [key: string]: Diagram };
  ids: string[];
  isFetchingDiagrams: boolean;
  isFetchingDiagram: boolean;
  isCreatingDiagram: boolean;
  error?: { message: string };
}

export const createInitialState = (): State => ({
  entities: {},
  ids: [],
  isFetchingDiagrams: false,
  isFetchingDiagram: false,
  isCreatingDiagram: false,
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
  }))
  .case(createDiagram.started, state => ({
    ...state,
    isCreatingDiagram: true,
  }))
  .case(createDiagram.done, state => ({
    ...state,
    isCreatingDiagram: false,
  }))
  .case(createDiagram.failed, state => ({
    ...state,
    isCreatingDiagram: false,
  }));
