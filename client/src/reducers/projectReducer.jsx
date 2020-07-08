export default function reducer(state = {
    slideNumber: 1
}, action) {
  switch (action.type) {
    case "SLIDE_CHANGE": {
      return {
        ...state,
        slideNumber: action.payload
      };
    }
  }
  return state;
}