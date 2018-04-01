import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Routes from './Routes';
import { configureStore } from './store';
import { Provider } from 'react-redux';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Xuumin</h1>
      </header>

      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  </Provider>
);

export default App;
