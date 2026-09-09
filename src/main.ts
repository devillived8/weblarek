import "./scss/styles.scss";
import { Buyer } from "./components/models/Buyer/Buyer";
import { ProductCatalog } from "./components/models/ProductCatalog/ProductCatalog";
import { Cart } from "./components/models/Cart/Cart";
import { Communication } from "./components/models/Communication/Communication";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { Header } from "./components/views/Header/Header";
import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/views/Modal/Modal";
import { CardPreview } from "./components/views/CardPreview/CardPreview";
import { cloneTemplate, ensureElement, setElementData } from "./utils/utils";
import { FormOrder } from "./components/views/FormOrder/FormOrder";
import { Gallery } from "./components/views/Gallery/Gallery";
import { CardCatalog } from "./components/views/CardCatalog/CardCatalog";
import { Basket } from "./components/views/Basket/Basket";
import { CardBasket } from "./components/views/CardBasket/CardBasket";
import { TPayment, IOrderData, IOrderResponse } from "./types";
import { FormContacts } from "./components/views/FormContacts/FormContacts";
import { Success } from "./components/views/Success/Success";

const events = new EventEmitter();
const api = new Api(API_URL);
const communication = new Communication(api);

const productCatalog = new ProductCatalog(events);
const buyer = new Buyer(events);
const cart = new Cart(events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(events, ensureElement<HTMLElement>(".modal"));
const header = new Header(events, ensureElement<HTMLElement>(".header"));

communication
  .getProducts()
  .then((response) => {
    productCatalog.setProducts(response.items);
  })
  .catch((error) => {
    console.error("Ошибка загрузки:", error);
  });

events.on("productCatalog:changed", () => {
  const products = productCatalog.getProducts();
  const cards = products.map((product) => {
    const cardElement = cloneTemplate<HTMLElement>("#card-catalog");
    setElementData(cardElement, {
      id: product.id,
    });
    const card = new CardCatalog(cardElement, events);
    return card.render(product);
  });
  gallery.catalog = cards;
});

events.on("cardCatalog:open", ({ id }: { id: string }) => {
  const product = productCatalog.getProduct(id);

  if (!product) return;

  productCatalog.setSelectedProduct(product);
});

events.on("product:selected", () => {
  const product = productCatalog.getSelectedProduct();

  if (!product) return;

  const cardElement = cloneTemplate<HTMLElement>("#card-preview");
  const cardPreview = new CardPreview(cardElement, events);

  if (product.price === null) {
    cardPreview.buttonDisabled = true;
    cardPreview.buttonText = "Недоступно";
  } else if (cart.contains(product.id)) {
    cardPreview.buttonDisabled = false;
    cardPreview.buttonText = "Удалить из корзины";
  } else {
    cardPreview.buttonDisabled = false;
    cardPreview.buttonText = "Купить";
  }

  modal.content = cardPreview.render(product);
  modal.open();
});

events.on("modal:close", () => {
  modal.close();
});

const renderBasket = (basket: Basket) => {
  const products = cart.getProducts();

  const cards = products.map((product, index) => {
    const cardElement = cloneTemplate<HTMLElement>("#card-basket");

    setElementData(cardElement, {
      id: product.id,
    });

    const card = new CardBasket(cardElement, events);

    return card.render({
      ...product,
      index: index + 1,
    });
  });

  basket.basketList = cards;
  basket.price = cart.getTotal();
};

let basket: Basket | null = null;

events.on("cart:changed", () => {
  header.counter = cart.getCount();
  if (basket) {
    renderBasket(basket);
  }
});

events.on("cardPreview:cartChanged", () => {
  const product = productCatalog.getSelectedProduct();
  if (!product) return;

  if (cart.contains(product.id)) {
    cart.removeProduct(product.id);
  } else {
    cart.addProduct(product);
  }

  modal.close();
});

events.on<{ id: string }>("cardBasket:delete", ({ id }) => {
  cart.removeProduct(id);
});

events.on("basket:open", () => {
  const basketElement = cloneTemplate<HTMLElement>("#basket");

  basket = new Basket(events, basketElement);

  renderBasket(basket);

  modal.content = basket.render();
  modal.open();
});

let formOrder: FormOrder | null = null;
let formContacts: FormContacts | null = null;

events.on("basket:checkout", () => {
  const formElement = cloneTemplate<HTMLElement>("#order");

  formOrder = new FormOrder(events, formElement);

  modal.content = formOrder.render();
  modal.open();
});

// Presenter
events.on<{ payment: TPayment }>("formOrder:payment", ({ payment }) => {
  buyer.setField("payment", payment);
});

events.on<{ field: "address"; value: string }>(
  "formOrder:addressChange",
  ({ field, value }) => {
    buyer.setField(field, value);
  },
);

events.on("buyer:changed", () => {
  const errors = buyer.validate();

  if (formOrder) {
    formOrder.errorText = [errors.payment, errors.address]
      .filter(Boolean)
      .join(" ");

    formOrder.submitDisabled = Boolean(errors.payment || errors.address);
  }
});

events.on("formOrder:submit", () => {
  const errors = buyer.validate();

  if (errors.payment || errors.address) {
    return;
  }

  const formElement = cloneTemplate<HTMLElement>("#contacts");

  formContacts = new FormContacts(events, formElement);

  modal.content = formContacts.render();
});

events.on<{ field: "email" | "phone"; value: string }>(
  "formContacts:change",
  ({ field, value }) => {
    buyer.setField(field, value);
  },
);

events.on("buyer:changed", () => {
  const errors = buyer.validate();

  if (formContacts) {
    formContacts.errorText = [errors.email, errors.phone]
      .filter(Boolean)
      .join(" ");

    formContacts.submitDisabled = Boolean(errors.email || errors.phone);
  }
});

events.on("formContacts:submit", () => {
  const errors = buyer.validate();

  if (errors.payment || errors.address || errors.email || errors.phone) {
    return;
  }

  const buyerData = buyer.getData();

  if (buyerData.payment === null) {
    return;
  }

  const orderData: IOrderData = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    items: cart.getProducts().map((product) => product.id),
    total: cart.getTotal(),
  };

  communication
    .postOrder(orderData)
    .then((response: IOrderResponse) => {
      const successElement = cloneTemplate<HTMLElement>("#success");
      const success = new Success(events, successElement);

      success.valueSpent = response.total;

      modal.content = success.render();
      cart.clearCart();
      buyer.clear();
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

events.on("success:submit", () => {
  modal.close();
});
