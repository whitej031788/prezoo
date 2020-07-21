class StorageService {
  static getPresFromLocalStorage(guid: string) {
    return window.localStorage.getItem('prezoo-' + guid);
  }

  static setPresLocalStorage(guid: string, prezooData: object) {
    return window.localStorage.setItem('prezoo-' + guid, JSON.stringify(prezooData));
  }
}

export default StorageService;