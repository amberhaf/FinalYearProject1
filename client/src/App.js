import React, { Component } from 'react';
import {
  Route, BrowserRouter as Router, Switch, Redirect,
} from "react-router-dom";
import PathMap from './pages/PathMap';
import Account from './pages/Account';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import InputPath from './pages/InputPath';
import { auth } from './services/firebase';
import { Forgot } from './pages/Forgot';
import { Delete } from './pages/DeleteAccount';


function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === false
        ? <Component {...props} />
        : <Redirect to='/' />}
    />
  )
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true,
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    })
  }

  render() {
    return this.state.loading === true ? <h2>Loading...</h2> : (
      <Router>
        <Switch>
          <Route exact path="/" component={PathMap}></Route>
          <PrivateRoute path="/Account" authenticated={this.state.authenticated} component={Account}></PrivateRoute>
          <PrivateRoute path="/profile" authenticated={this.state.authenticated} component={Profile}></PrivateRoute>
          <PrivateRoute path="/inputPath" authenticated={this.state.authenticated} component={InputPath}></PrivateRoute>
          <Route exact path = "/forgot" component={Forgot}></Route>
          <Route exact path = "/deleteAccount" component={Delete}></Route>

          <PublicRoute path="/signup" authenticated={this.state.authenticated} component={Signup}></PublicRoute>
          <PublicRoute path="/login" authenticated={this.state.authenticated} component={Login}></PublicRoute>
        </Switch>
      </Router>
    );
  }
}

export default App;
