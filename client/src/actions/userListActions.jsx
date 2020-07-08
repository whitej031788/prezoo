export function receiveUserList(data) {
  return {
    type: "USERLIST_ADD",
    payload: data
  };
}