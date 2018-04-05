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
  .case(fetchDiagrams.failed, state => ({
    ...state,
    isFetchingDiagrams: false,
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
  .case(fetchDiagram.failed, state => ({
    ...state,
    isFetchingDiagram: false,
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
