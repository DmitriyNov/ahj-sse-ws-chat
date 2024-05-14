import ChatAPI from "./api/ChatAPI";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI("https://sse-ws-chat-backend.onrender.com");
    this.websocket = null;
    this.userName = "";
    this.userId = null;
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
  }

  bindToDOM() {
    this.container.innerHTML = `
      <div class="container">
        <div class="chat__header">Chat</div>
          <div class="chat__container">
            <div class="chat__userlist">
            </div>
            <div class="chat__area">
              <div class="chat__messages-container">
              </div>
              <form class="form">
                <input type="text" class="chat__messages-input" placeholder="Type your message here">
              </form>
            </div>
        </div>
      </div>
      <div class="modal__form active">
        <div class="modal__background"></div>
        <div class="modal__content">
          <div class="modal__header">Выберите псевдоним</div>
          <div class="modal__body">
            <form class="form__group">
              <div class="form__label">
                <input type="text" class="form__input">
              </div>
                <input type="submit" class="modal__close">
            </form>
          </div>
        </div>
      </div>
    `;
  }

  registerEvents() {
    const chatInput = document.querySelector(".chat__messages-input");
    const chatForm = document.querySelector(".form");
    const nicknameInput = document.querySelector(".form__input");
    const nicknameSubmit = document.querySelector(".modal__close");
    const modal = document.querySelector(".modal__form");

    nicknameSubmit.addEventListener("click", (event) => {
      event.preventDefault();
      let nickname = nicknameInput.value;
      if (nickname.length == 0) {
        return;
      }
      this.api.login(nickname, (response) => {
        this.userName = response.user.name;
        this.userId = response.user.id;
        modal.classList.remove("active");
        this.onEnterChatHandler();
      });
    });

    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = chatInput.value;
      if (!text) {
        return;
      }
      const time = Date.now();
      this.websocket.send(
        JSON.stringify({
          type: "send",
          text: text,
          time: time,
          user: {
            name: this.userName,
            id: this.userId,
          },
        })
      );
      chatInput.value = "";
    });

    window.addEventListener("beforeunload", () => {
      this.websocket.send(
        JSON.stringify({
          type: "exit",
          user: {
            name: this.userName,
            id: this.userId,
          },
        })
      );
    });
  }

  onEnterChatHandler() {
    this.websocket = new WebSocket("ws://sse-ws-chat-backend.onrender.com/ws");
    const userList = document.querySelector(".chat__userlist");

    this.websocket.addEventListener("open", (event) => {
      console.log(event);
      console.log("ws open");
    });

    this.websocket.addEventListener("close", (event) => {
      console.log(event);
      console.log("ws close");
    });

    this.websocket.addEventListener("error", (event) => {
      console.log(event);
      console.log("ws error");
    });

    this.websocket.addEventListener("message", (event) => {
      console.log(event);
      console.log("ws message");
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        userList.innerHTML = "";
        data.forEach((user) => {
          if (user.name === this.userName) {
            userList.insertAdjacentHTML(
              "beforeend",
              `<div class="chat__user">You</div>`
            );
          } else {
            userList.insertAdjacentHTML(
              "beforeend",
              `<div class="chat__user">${user.name}</div>`
            );
          }
        });
      } else if (data.type === "send") {
        this.renderMessage(data);
      }
    });
  }

  renderMessage(message) {
    const chatContainer = document.querySelector(".chat__messages-container");
    let containerClass = "";
    const date = new Date(message.time);
    let time = "";

    if (String(date.getHours()).length < 2) {
      time += "0" + date.getHours() + ".";
    } else {
      time += date.getHours() + ".";
    }
    if (String(date.getMinutes()).length < 2) {
      time += "0" + date.getMinutes() + " ";
    } else {
      time += date.getMinutes() + " ";
    }
    if (String(date.getDay()).length < 2) {
      time += "0" + date.getDay() + ".";
    } else {
      time += date.getDay() + ".";
    }
    if (String(date.getMonth()).length < 2) {
      time += "0" + date.getMonth() + "." + date.getFullYear();
    } else {
      time += date.getMonth() + "." + date.getFullYear();
    }

    if (message.user.name === this.userName) {
      containerClass = "message__container-yourself";
    } else {
      containerClass = "message__container-interlocutor";
    }

    chatContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="message__container ${containerClass}">
        <div class="message__header">
          <p>${message.user.name},<br/>${time}</p>
        </div>
        <p>${message.text}</p>
      </div>`
    );
  }
}
