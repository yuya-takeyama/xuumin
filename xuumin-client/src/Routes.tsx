import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import ShowDiagram from './components/diagrams/ShowDiagram';
import NewDiagram from './components/diagrams/NewDiagram';

export default () => (
  <Switch>
    <Route path="/" component={Home} exact />
    <Route path="/diagrams/new" component={NewDiagram} />
    <Route path="/diagrams/:id" component={ShowDiagram} />
  </Switch>
);
