import typescriptFsa from 'typescript-fsa';
import { Diagram } from '../interfaces';
import { State } from '../reducers';
import { ensureError } from '../utils';
import { ThunkAction } from 'redux-thunk';
import { normalize } from 'normalizr';
import { diagramsSchema, NormalizedDiagrams } from '../schema';

const actionCreatorFactory = typescriptFsa('DIAGRAM');

export const fetchDiagrams = actionCreatorFactory.async<
  undefined,
  NormalizedDiagrams,
  Error
>('FETCH_DIAGRAMS');

export const fetchDiagram = actionCreatorFactory.async<
  FetchDiagramParams,
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
  Promise<NormalizedDiagrams>,
  State,
  void
> => async dispatch => {
  dispatch(fetchDiagrams.started(undefined));

  try {
    const res = await fetch('/v1/diagrams');
    const json = await res.json();

    if (res.ok) {
      const normalized = normalize(json, diagramsSchema);
      const normalizedDiagrams = {
        entities: normalized.entities.diagrams,
        ids: normalized.result.diagrams,
      };
      dispatch(
        fetchDiagrams.done({
          params: undefined,
          result: normalizedDiagrams,
        }),
      );

      return normalizedDiagrams;
    }

    throw new Error(json.error);
  } catch (err) {
    const error = ensureError(err);
    dispatch(
      fetchDiagrams.failed({
        error,
        params: undefined,
      }),
    );

    return Promise.reject(error);
  }
};

export interface FetchDiagramParams {
  uuid: string;
}

export const fetchDiagramRequest = (
  params: FetchDiagramParams,
): ThunkAction<Promise<Diagram>, State, void> => async dispatch => {
  dispatch(fetchDiagram.started(params));
  try {
    const res = await fetch(`/v1/diagrams/${params.uuid}`);
    const json = await res.json();

    if (res.ok) {
      dispatch(
        fetchDiagram.done({
          params,
          result: json,
        }),
      );

      return json;
    }

    throw new Error(json.error);
  } catch (err) {
    const error = ensureError(err);
    dispatch(
      fetchDiagram.failed({
        params,
        error,
      }),
    );

    return Promise.reject(error);
  }
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
