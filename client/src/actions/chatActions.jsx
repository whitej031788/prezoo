export function receiveMessage(data) {
  return {
    type: "MESSAGE_ADD",
    payload: data
  };
}