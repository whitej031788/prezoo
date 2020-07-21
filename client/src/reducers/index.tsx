import { combineReducers } from 'redux';

import user from './userReducer';
import userList from './userListReducer';
import chat from './chatReducer';
// Rename to presentation to stop clashes with already used name project
import presentation from './presentationReducer';

export const rootReducer = combineReducers({
  user,
  userList,
  chat,
  presentation
});

export type RootState = ReturnType<typeof rootReducer>;