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
console.log('Получение всех товаров - ',  productCatalog.getProducts());
console.log('Получаем продукт по ID - ', productCatalog.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
productCatalog.setSelectedProduct(apiProducts.items[0]);
console.log('Получаем выбранный продукт - ', productCatalog.getSelectedProduct());
// Тесты класса Cart

const cart = new Cart();
console.log("--------------Класс-Cart--------------");

for (let i = 0; i < apiProducts.items.length; i++) {
  cart.addProduct(apiProducts.items[i]);
}

console.log('Получаем все продукты в корзине - ', cart.getProducts());
cart.removeProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
console.log('Проверяем удаление продукта и выводим результат - ', cart.getProducts());
cart.clearCart();
console.log('Проверяем полную очистку корзины - ', cart.getProducts());
for (let i = 0; i < apiProducts.items.length; i++) {
  cart.addProduct(apiProducts.items[i]);
}
console.log('Получаем общую стоимость - ', cart.getTotal());
console.log('Получаем количество товаров в корзине - ', cart.getCount());
console.log('Проверяем наличие товара в корзине по ID - ', cart.contains("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
console.log('Проверяем наличие товара в корзине по ID - ', cart.contains("gfdsgsfdg"));
// Тесты класса Buyer
const buyer = new Buyer();
console.log("--------------Класс-Buyer--------------");
buyer.setField("payment", "cash");
buyer.setField("email", "gdfsgfdsg");
buyer.setField("phone", "+895432534253");
buyer.setField("address", "gsdfgfdsgf");
console.log('Получаем информацию о покупателе - ', buyer.getData());
buyer.clear();
console.log('Проверяем метод очистки данных покупателя и получаем информацию о покупателе - ', buyer.getData());
console.log('Проверяем данные на null - ', buyer.validate());
console.log('Проверяем метод возвращающий булево значение, относительно массива ошибок - ', buyer.isValid());
buyer.setField("payment", "card");
buyer.setField("email", "gdfsgfdsg");
buyer.setField("phone", "+895432534253");
buyer.setField("address", "gsdfgfdsgf");
console.log('Проверяем данные на null - ', buyer.validate());
console.log('Проверяем метод возвращающий булево значение, относительно массива ошибок - ', buyer.isValid());
// Тесты класса Communication
const api = new Api(API_URL);
const communication = new Communication(api);
console.log("----------Класс-Communication----------");
communication
  .getProducts()
  .then((response) => {
    productCatalog.setProducts(response.items);
    console.log("Получаем данные о продуктах после заполнения с ответа сервера - ", productCatalog.getProducts());
    console.log("Всего товаров:", response.total);
    console.log("---------------------------------------");
  })
  .catch((error) => {
    console.error("❌ Ошибка загрузки:", error);
    console.log("---------------------------------------");
  });
