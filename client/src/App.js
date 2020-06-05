import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Explore from './components/layout/Explore';
import ImportLibrary from './components/layout/ImportLibrary';
import Settings from './components/layout/Settings';
import SocialLogin from './components/auth/SocialLogin';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const entry_url = window.location.href;
  const exp = new RegExp('/auth/login');

  useEffect(() => {
    if (!entry_url.match(exp)) {
      store.dispatch(loadUser());
    } else {
      console.log('Social Page!');
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar hidden={false} />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <ImportLibrary />
            <Switch>
              <Route exact path='/auth/login' component={SocialLogin} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/explore' component={Explore} />
              <PrivateRoute exact path='/settings' component={Settings} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
