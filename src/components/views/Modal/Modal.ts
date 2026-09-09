import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected modalBtnClose: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.modalBtnClose = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.modalBtnClose.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (e: Event) => {
      if (e.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }

  set content(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.contentElement.innerHTML = "";
  }
}
