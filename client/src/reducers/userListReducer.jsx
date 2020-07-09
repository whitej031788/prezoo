export default function reducer(state = {
    userList: []
}, action) {
  switch (action.type) {
    case "USERLIST_ADD": {
      return {
        ...state,
        userList: action.payload
      };
    }
    default: {
      break;
    }
  }
  return state;
}