export function receivePresentation(data) {
  return {
    type: "SLIDE_CHANGE",
    payload: data
  };
}