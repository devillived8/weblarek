import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface ISuccess {
  valueSpent: number;
}

export class Success extends Component<ISuccess> {
  protected valueSpentElement: HTMLElement;
  protected successBtn: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.valueSpentElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.successBtn = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.successBtn.addEventListener("click", () => {
      this.events.emit("success:submit");
    });
  }

  set valueSpent(value: number) {
    this.valueSpentElement.textContent = `Списано ${value} синапсов`;
  }
}
