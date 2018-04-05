import typescriptFsa from 'typescript-fsa';
import { Diagram } from '../interfaces';
import { State } from '../reducers';
import { ensureError } from '../utils';
import { ThunkAction } from 'redux-thunk';
import { normalize } from 'normalizr';
import { diagramsSchema } from '../schema';

const actionCreatorFactory = typescriptFsa('DIAGRAM');

export const fetchDiagrams = actionCreatorFactory.async<
  undefined,
  {
    entities: { [key: string]: Diagram };
    ids: string[];
  },
  Error
>('FETCH_DIAGRAMS');

export const fetchDiagram = actionCreatorFactory.async<
  { uuid: string },
  Diagram,
  Error
>('FETCH_DIAGRAM');

export interface CreateDiagramParams {
  title: string;
  source: string;
}

export const createDiagram = actionCreatorFactory.async<
  CreateDiagramParams,
  Diagram,
  Error
>('CREATE_DIAGRAM');

export const fetchDiagramsRequest = (): ThunkAction<
  void,
  State,
  void
> => dispatch => {
  dispatch(fetchDiagrams.started(undefined));
  fetch('/v1/diagrams')
    .then(res => res.json())
    .then(diagrams => {
      const normalized = normalize(diagrams, diagramsSchema);
      dispatch(
        fetchDiagrams.done({
          params: undefined,
          result: {
            entities: normalized.entities.diagrams,
            ids: normalized.result.diagrams,
          },
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
          result: json,
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

export const createDiagramRequest = (
  params: CreateDiagramParams,
): ThunkAction<Promise<Diagram>, State, void> => async (
  dispatch,
): Promise<Diagram> => {
  dispatch(createDiagram.started(params));
  try {
    const res = await fetch('/v1/diagrams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();

    if (res.ok) {
      dispatch(createDiagram.done({ params, result: json }));
      return json;
    }

    throw new Error(json.error);
  } catch (err) {
    const error = ensureError(err);
    dispatch(
      createDiagram.failed({
        params,
        error,
      }),
    );

    return Promise.reject(error);
  }
};
