import { compose, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers, { State, createInitialState } from './reducers';
import reduxThunk from 'redux-thunk';

const createEnhancer = () => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(reduxThunk));
  }

  return compose(applyMiddleware(reduxThunk));
};

export const configureStore = () => {
  const enhancer = createEnhancer();
  return createStore<State>(reducers, createInitialState(), enhancer);
};
