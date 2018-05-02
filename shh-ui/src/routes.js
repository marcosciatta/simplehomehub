import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import Home from './components/Home';
import ComponentsPage from './components/ComponentsPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component="{Home}"/>
    <Route path="/components" component={ComponentsPage} />
  </Route>
);
