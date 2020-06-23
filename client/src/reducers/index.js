import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import playlist from './playlist';
import library from './library';
import filter from './filter';
import importLibrary from './importLibrary';
import { LOGOUT } from '../actions/types';

export const appReducer = combineReducers({
  alert,
  auth,
  importLibrary,
  playlist,
  library,
  filter,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
