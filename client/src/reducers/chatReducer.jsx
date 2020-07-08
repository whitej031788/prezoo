export default function reducer(state = {
    messages: []
}, action) {
switch (action.type) {
    case "MESSAGE_ADD": {
      return {
        messages: [
          ...state.messages,
          action.payload
        ]
      };
    }
  }
  return state;
}