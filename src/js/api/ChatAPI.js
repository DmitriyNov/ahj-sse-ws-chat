import createRequest from "./createRequest";

export default class ChatAPI {
  constructor(url) {
    this.url = url;
  }

  login(username, callback) {
    createRequest({
      url: this.url + "/new-user",
      data: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username }),
      },
      callback: callback,
    });
  }
}
