import typescriptFsa from 'typescript-fsa';
import { Diagram } from '../interfaces';
import { State } from '../reducers';
import { ensureError } from '../utils';
import { ThunkAction } from 'redux-thunk';

const actionCreatorFactory = typescriptFsa('DIAGRAM');

export const fetchDiagrams = actionCreatorFactory.async<
  undefined,
  { diagrams: Diagram[] },
  Error
>('FETCH_DIAGRAMS');

export const fetchDiagram = actionCreatorFactory.async<
  { uuid: string },
  Diagram,
  Error
>('FETCH_DIAGRAM');

export const fetchDiagramsRequest = (): ThunkAction<
  void,
  State,
  void
> => dispatch => {
  dispatch(fetchDiagrams.started(undefined));
  fetch('/v1/diagrams')
    .then(res => res.json())
    .then(diagrams => {
      dispatch(
        fetchDiagrams.done({
          params: undefined,
          result: diagrams,
        }),
      );
    })
    .catch(err => {
      dispatch(
        fetchDiagrams.failed({
          params: undefined,
          error: ensureError(err),
        }),
      );
    });
};

export const fetchDiagramRequest = (params: {
  uuid: string;
}): ThunkAction<void, State, void> => dispatch => {
  dispatch(fetchDiagram.started(params));
  fetch(`/v1/diagrams/${params.uuid}`)
    .then(res => res.json())
    .then(json => {
      dispatch(
        fetchDiagram.done({
          params,
          result: json.diagrams,
        }),
      );
    })
    .catch(err => {
      dispatch(
        fetchDiagram.failed({
          params,
          error: ensureError(err),
        }),
      );
    });
};
