import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Test from './Test'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
    <div className="container-fluid  h-100">
      <div className="row h-100">
          <div className="col-md-2 bg-light  h-100" id="left_column">
          </div>
          <div className="col-md-10">
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route path='/test' component={Test}/>
            </Switch>
          </div>
      </div>
    </div>
)

export default Main
