import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class Cart {
  private cartProducts: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getProducts(): IProduct[] {
    return this.cartProducts;
  }

  addProduct(product: IProduct): void {
    this.cartProducts.push(product);
    this.events.emit("cart:changed");
  }

  removeProduct(id: string): void {
    this.cartProducts = this.cartProducts.filter(
      (product) => product.id !== id,
    );

    this.events.emit("cart:changed");
  }

  clearCart(): void {
    this.cartProducts = [];
    this.events.emit("cart:changed");
  }

  getTotal(): number {
    return this.cartProducts.reduce((acc, product) => {
      return acc + (product.price ?? 0);
    }, 0);
  }

  getCount(): number {
    return this.cartProducts.length;
  }

  contains(id: string): boolean {
    return this.cartProducts.some((product) => product.id === id);
  }
}
