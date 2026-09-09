import { Card, ICard } from "../Card/Card";
import { ensureElement, getElementData } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected cardDelete: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.cardDelete = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.cardDelete.addEventListener("click", () => {
      const { id } = getElementData<{ id: string }>(this.container, {
        id: String,
      });

      this.events.emit("cardBasket:delete", { id });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
