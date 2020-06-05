import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import playlist from './playlist';
import library from './library';
import importLibrary from './importLibrary';
import settings from './settings';

export default combineReducers({
  alert,
  auth,
  importLibrary,
  playlist,
  library,
  settings,
});
