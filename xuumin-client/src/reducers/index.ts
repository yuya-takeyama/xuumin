import { combineReducers } from 'redux';
import {
  diagramReducer as diagram,
  State as DiagramState,
  createInitialState as createDiagramInitialState,
} from './diagramReducer';

export interface State {
  diagram: DiagramState;
}

export const createInitialState = (): State => ({
  diagram: createDiagramInitialState(),
});

export default combineReducers({ diagram });
