import { combineReducers } from 'redux';

import user from './userReducer';
import userList from './userListReducer';
import chat from './chatReducer';
import project from './projectReducer';

export default combineReducers({
  user,
  userList,
  chat,
  project
});