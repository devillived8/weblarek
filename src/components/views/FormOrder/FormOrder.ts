import { ensureElement } from "../../../utils/utils";
import { Form } from "../Form/Form";
import { IEvents } from "../../base/Events";
import { TPayment } from "../../../types";

export class FormOrder extends Form {
  protected submitBtn: HTMLButtonElement;
  protected paymentButtons: HTMLButtonElement[];
  protected addressDeliveryElement: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.paymentButtons = Array.from(
      this.container.querySelectorAll<HTMLButtonElement>(".button_alt"),
    );
    this.submitBtn = ensureElement<HTMLButtonElement>(
      ".order__button",
      this.container,
    );
    this.addressDeliveryElement = ensureElement<HTMLInputElement>(
      '.form__input[name="address"]',
      this.container,
    );

    this.submitBtn.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.events.emit("formOrder:submit");
    });

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("formOrder:payment", {
          payment: button.name as TPayment,
        });
      });
    });

    this.addressDeliveryElement.addEventListener("input", () => {
      this.events.emit("formOrder:addressChange", {
        field: "address",
        value: this.addressDeliveryElement.value,
      });
    });
  }

  set submitDisabled(value: boolean) {
    this.submitBtn.disabled = value;
  }

  set address(address: string) {
    this.addressDeliveryElement.value = address;
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle("button_alt-active", btn.name === value);
    });
  }
}
