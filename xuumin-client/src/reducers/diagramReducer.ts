import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Diagram } from '../interfaces';
import { fetchDiagrams } from '../actions/diagramActions';

export interface State {
  diagrams: Diagram[];
  isFetchingDiagrams: boolean;
  error?: Error;
}

export const createInitialState = (): State => ({
  diagrams: [],
  isFetchingDiagrams: false,
});

export const diagramReducer = reducerWithInitialState(createInitialState())
  .case(fetchDiagrams.started, state => ({
    ...state,
    isFetchingDiagrams: true,
  }))
  .caseWithAction(fetchDiagrams.done, (state, action) => ({
    ...state,
    diagrams: action.payload.result.diagrams,
    isFetchingDiagrams: false,
  }))
  .caseWithAction(fetchDiagrams.failed, (state, action) => ({
    ...state,
    error: action.payload.error,
    isFetchingDiagrams: false,
  }));
