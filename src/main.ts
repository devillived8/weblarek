import "./scss/styles.scss";
import { Buyer } from "./components/models/Buyer/Buyer";
import { apiProducts } from "./utils/data";
import { ProductCatalog } from "./components/models/ProductCatalog/ProductCatalog";
import { Cart } from "./components/models/Cart/Cart";
import { Communication } from "./components/models/Communication/Communication";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";

// Тесты класса ProductCatalog
const productCatalog = new ProductCatalog();
console.log("---------Класс-ProductCatalog---------");
productCatalog.setProducts(apiProducts.items);
console.log(productCatalog.getProducts());
console.log(productCatalog.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
productCatalog.setSelectedProduct(apiProducts.items[0]);
console.log(productCatalog.getSelectedProduct());
// Тесты класса Cart

const cart = new Cart();
console.log("--------------Класс-Cart--------------");

for (let i = 0; i < apiProducts.items.length; i++) {
  cart.addProduct(apiProducts.items[i]);
}

console.log(cart.getProducts());
cart.removeProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
console.log(cart.getProducts());
cart.clearCart();
console.log(cart.getProducts());
for (let i = 0; i < apiProducts.items.length; i++) {
  cart.addProduct(apiProducts.items[i]);
}
console.log(cart.getTotal());
console.log(cart.getCount());
console.log(cart.contains("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
console.log(cart.contains("gfdsgsfdg"));
// Тесты класса Buyer
const buyer = new Buyer();
console.log("--------------Класс-Buyer--------------");
buyer.setField("payment", "online");
buyer.setField("email", "gdfsgfdsg");
buyer.setField("phone", "+895432534253");
buyer.setField("address", "gsdfgfdsgf");
console.log(buyer.getData());
buyer.clear();
console.log(buyer.getData());
console.log(buyer.validate());
console.log(buyer.isValid());
buyer.setField("payment", "online");
buyer.setField("email", "gdfsgfdsg");
buyer.setField("phone", "+895432534253");
buyer.setField("address", "gsdfgfdsgf");
console.log(buyer.validate());
console.log(buyer.isValid());
// Тесты класса Communication
const api = new Api(API_URL);
const communication = new Communication(api);
console.log("----------Класс-Communication----------");
communication
  .getProducts()
  .then((response) => {
    productCatalog.setProducts(response.items);
    console.log("Товары загружены:", productCatalog.getProducts());
    console.log("Всего товаров:", response.total);
    console.log("---------------------------------------");
  })
  .catch((error) => {
    console.error("❌ Ошибка загрузки:", error);
    console.log("---------------------------------------");
  });
