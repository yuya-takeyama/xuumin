import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Diagram } from '../interfaces';
import { fetchDiagrams, fetchDiagram } from '../actions/diagramActions';

export interface State {
  diagrams: Diagram[];
  isFetchingDiagrams: boolean;
  diagram?: Diagram;
  isFetchingDiagram: boolean;
  error?: Error;
}

export const createInitialState = (): State => ({
  diagrams: [],
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
    diagrams: action.payload.result.diagrams,
    isFetchingDiagrams: false,
  }))
  .caseWithAction(fetchDiagrams.failed, (state, action) => ({
    ...state,
    error: action.payload.error,
    isFetchingDiagrams: false,
  }))
  .case(fetchDiagram.started, state => ({
    ...state,
    isFetchingDiagram: true,
  }))
  .caseWithAction(fetchDiagram.done, (state, action) => ({
    ...state,
    isFetchingDiagram: false,
    diagram: action.payload.result,
  }))
  .caseWithAction(fetchDiagram.failed, (state, action) => ({
    ...state,
    isFetchingDiagram: false,
    error: action.payload.error,
  }));
