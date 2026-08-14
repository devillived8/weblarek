export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'cashOnDelivery' | null;

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}


export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

export interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  products: string[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

