export default function reducer(state = {
    userName: null
}, action) {
  switch (action.type) {
    case "USER_ADD": {
      return {
        ...state,
        userName: action.payload
      };
    }
    default: {
      break;
    }
  }
  return state;
}