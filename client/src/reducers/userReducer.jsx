export default function reducer(state = {
    userName: null
}, action) {
  switch (action.type) {
    case "USER_ADD": {
      console.log(action);
      return {
        ...state,
        userName: action.payload
      };
    }
  }
  return state;
}