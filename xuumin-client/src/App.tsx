import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Routes from './Routes';

const App = () => (
  <div className="App">
    <header className="App-header">
      <h1 className="App-title">Xuumin</h1>
    </header>

    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </div>
);

export default App;
