import { Card, ICard } from "../Card/Card";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { CDN_URL, categoryMap } from "../../../utils/constants";

interface ICardPreview extends ICard {
  category: string;
  image: string;
  description: string;
}

export class CardPreview extends Card<ICardPreview> {
  protected categoryElement: HTMLElement;
  protected imgElement: HTMLImageElement;
  protected cardBuy: HTMLButtonElement;
  protected cardText: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imgElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.cardBuy = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.cardText = ensureElement<HTMLElement>(".card__text", this.container);

    this.cardBuy.addEventListener("click", () => {
      this.events.emit("cardPreview:cartChanged");
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
  }

  set image(value: string) {
    this.imgElement.src = `${CDN_URL}${value}`;
  }

  set description(value: string) {
    this.cardText.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardBuy.disabled = value;
  }

  set buttonText(value: string) {
    this.cardBuy.textContent = value;
  }
}
