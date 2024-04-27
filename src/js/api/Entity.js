import createRequest from './createRequest';

export default class Entity {
  constructor(url) {
    this.url = url;
  }

  list(callback) {
    createRequest({
      url: this.URL,
      data: {method: 'GET'},
      callback: callback,
    });
  }

  get() {}

  create() {}

  update() {}

  delete() {}
}
