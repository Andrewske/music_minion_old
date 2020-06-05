import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import importLibrary from './importLibrary';
import settings from './settings';

export default combineReducers({
  alert,
  auth,
  importLibrary,
  settings,
});
