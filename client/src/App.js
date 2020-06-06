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
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
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
