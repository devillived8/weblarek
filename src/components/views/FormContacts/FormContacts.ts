import { ensureElement } from "../../../utils/utils";
import { Form } from "../Form/Form";
import { IEvents } from "../../base/Events";

export class FormContacts extends Form {
  protected submitBtn: HTMLButtonElement;
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.emailInputElement = ensureElement<HTMLInputElement>(
      '.form__input[name="email"]',
      this.container,
    );
    this.submitBtn = ensureElement<HTMLButtonElement>(
      ".button",
      this.container,
    );
    this.phoneInputElement = ensureElement<HTMLInputElement>(
      '.form__input[name="phone"]',
      this.container,
    );

    this.submitBtn.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.events.emit("formContacts:submit");
    });

    this.emailInputElement.addEventListener("change", () => {
      this.events.emit("formContacts:change", {
        field: "email",
        value: this.emailInputElement.value,
      });
    });

    this.phoneInputElement.addEventListener("change", () => {
      this.events.emit("formContacts:change", {
        field: "phone",
        value: this.phoneInputElement.value,
      });
    });
  }

  set submitDisabled(value: boolean) {
    this.submitBtn.disabled = value;
  }

  set email(email: string) {
    this.emailInputElement.value = email;
  }

  set phone(phone: string) {
    this.phoneInputElement.value = phone;
  }
}
