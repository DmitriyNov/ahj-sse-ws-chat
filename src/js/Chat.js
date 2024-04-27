import ChatAPI from "./api/ChatAPI";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
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
                <input type="text" class="chat__messages-input form__input">
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
    `
  }

  registerEvents() {
    const ChatInput = document.querySelector(".chat__messages-input");
    const NicknameSubmit = document.querySelector(".modal__close");

    ChatInput.addEventListener("submit", (event) => {
      event.preventDefault();

    });
    NicknameSubmit.addEventListener("submit", (event) => {
      event.preventDefault();
      
    });
  }

  subscribeOnEvents() {}

  onEnterChatHandler() {}

  sendMessage(text) {

  }

  renderMessage() {

  }
}
