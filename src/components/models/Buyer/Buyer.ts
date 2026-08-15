import { IBuyer, TBuyerErrors, TPayment } from "../../../types";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    (this as any)[field] = value;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (this.payment === null) {
      errors.payment = "Пожалуйста, выберите способ оплаты";
    }

    if (!this.email.trim()) {
      errors.email = "Пожалуйста, укажите email";
    }

    if (!this.phone.trim()) {
      errors.phone = "Пожалуйста, укажите телефон";
    }

    if (!this.address.trim()) {
      errors.address = "Пожалуйста, укажите адрес доставки";
    }

    return errors;
  }

  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }
}
