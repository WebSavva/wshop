import { MethodPaymentType } from "./ReduxStates";
import { IShippingAddress } from "./ReduxStates";
export interface IOrderItem {
  product: string;
  name: string;
  image: string;
  qty: number;
  price: number;
}

export interface IOrder {
  id: string;
  user: {
    name: string;
    email: string;
    isAdmin: boolean;
    id: string;
  };
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  orderItems: IOrderItem[];
  paymentMethod: MethodPaymentType;
  shippingAddress: IShippingAddress;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: boolean;
  createdAt: string;
  updatedAt: string;
  paymentResult?: {
    id: string;
    email: string;
    status: string;
    update_time: string;
  };
}
