import { Card, ICard } from "../Card/Card";
import { ensureElement, getElementData } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { CDN_URL, categoryMap } from "../../../utils/constants";

type TCategory = keyof typeof categoryMap;

interface ICardCatalog extends ICard {
  category: TCategory;
  image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected categoryElement: HTMLElement;
  protected imgElement: HTMLImageElement;

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

    this.container.addEventListener("click", () => {
      const { id } = getElementData<{ id: string }>(this.container, {
        id: String,
      });

      this.events.emit("cardCatalog:open", { id });
    });
  }

  set category(value: TCategory) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.add(categoryMap[value]);
  }

  set image(value: string) {
    this.imgElement.src = `${CDN_URL}${value}`;
  }
}
