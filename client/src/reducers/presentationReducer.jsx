export default function reducer(state = {
    slideNumber: 0
}, action) {
  switch (action.type) {
    case "SLIDE_CHANGE": {
      return {
        ...state,
        slideNumber: action.payload
      };
    }
    default: {
      break;
    }
  }
  return state;
}