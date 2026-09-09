import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export abstract class Form extends Component<object> {
  protected errorTextElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.errorTextElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
  }

  set errorText(error: string) {
    this.errorTextElement.textContent = error;
  }
}
