export function receiveUser(data) {
  return {
    type: "USER_ADD",
    payload: data
  };
}