import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from "react-redux";
import { loadComponents } from './actions/componentActions';
import configureStore from "./store/index";


//Init application ?
const store = configureStore();
store.dispatch(loadComponents());

ReactDOM.render((
  <Provider store={store }>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));

console.log(store.getState());

registerServiceWorker();
