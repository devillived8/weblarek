import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface IBasket {
  price: number;
}

export class Basket extends Component<IBasket> {
  protected basketListElement: HTMLElement;
  protected basketBtn: HTMLButtonElement;
  protected basketPriceElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.basketPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.basketBtn = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.basketListElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );

    this.basketBtn.addEventListener("click", () => {
      this.events.emit("basket:checkout");
    });
  }

  set price(value: number) {
    this.basketPriceElement.textContent = `${value} синапсов`;
  }

  set basketList(list: HTMLElement[]) {
    if (list.length === 0) {
      this.basketListElement.innerHTML =
        '<p class="basket__empty">Корзина пуста</p>';
      this.basketBtn.disabled = true;
    } else {
      this.basketListElement.replaceChildren(...list);
      this.basketBtn.disabled = false;
    }
  }
}
