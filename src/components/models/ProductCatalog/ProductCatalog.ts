import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class ProductCatalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]) {
    this.products = products;
    this.events.emit("productCatalog:changed");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProduct(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("product:selected");
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
