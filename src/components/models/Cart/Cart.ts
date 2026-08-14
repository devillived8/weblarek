import { IProduct } from "../../../types";

export class Cart {
  private cartProducts: IProduct[] = [];

  getProducts(): IProduct[] {
    return this.cartProducts;
  }

  addProduct(product: IProduct): void {
    this.cartProducts.push(product);
  }

  removeProduct(id: string): void {
    this.cartProducts = this.cartProducts.filter(
      (product) => product.id !== id,
    );
  }

  clearCart(): void {
    this.cartProducts = [];
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
