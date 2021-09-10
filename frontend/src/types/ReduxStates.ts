import {
  IProduct,
  IShortenedProduct,
  IProductResponse,
} from "./ProductInterface";
import { Draft, PayloadAction } from "@reduxjs/toolkit";
import { IUserInfo } from "./AuthInterface";
import { IOrder } from "./Order";

export interface IPartialRequestState {
  isFetching: boolean;
  error: null | string;
  data: any;
}

export interface IProductsState extends IPartialRequestState {
  data: IProductResponse;
}

export interface IUserAuthState extends IPartialRequestState {
  data: IUserInfo | null;
}

export interface IProductState extends IPartialRequestState {
  data: IProduct | null;
}

export interface INewOrderState extends IPartialRequestState {
  data: IOrder | null;
}

export type IShippingAddress =
  | {
      contry: string;
      city: string;
      postalCode: string;
    }
  | {};

export type MethodPaymentType = "paypal" | "stripe";

export interface ICartState {
  cartItems: IShortenedProduct[];
  shippingAddress: IShippingAddress;
  paymentMethod: MethodPaymentType;
}

export interface httpReducer<StateType, ActionDataType> {
  (state: Draft<StateType>, action?: PayloadAction<ActionDataType>): void;
}

export interface onFetchedHandler {
  (
    data: any,
    args?: {
      [name: string]: any;
    }
  ): void;
}
