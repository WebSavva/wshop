import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ICartState,
  IShippingAddress,
  MethodPaymentType,
} from "../types/ReduxStates";
import { IShortenedProduct } from "../types/ProductInterface";
import { AppDispatch, RootState } from "./store";

function initiateCartProperty<GeneratedType>(
  name: string,
  defaultValue: any
): GeneratedType {
  let storedValue = localStorage.getItem(name);
  if (storedValue) {
    return JSON.parse(storedValue) as GeneratedType;
  } else {
    return defaultValue as GeneratedType;
  }
}
const initialCartState: ICartState = {
  cartItems: initiateCartProperty<IShortenedProduct[]>("cart-items", []),
  shippingAddress: initiateCartProperty<IShippingAddress>(
    "shipping-address",
    {}
  ),
  paymentMethod: "paypal",
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addNewItem(state, action: PayloadAction<IShortenedProduct>) {
      const existedItemIndex = state.cartItems.findIndex(
        ({ id }) => action.payload.id === id
      );

      if (existedItemIndex !== -1) {
        state.cartItems[existedItemIndex] = action.payload;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    emptyOutCart(state) {
      state.cartItems = [];
    },
    removeItem(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(
        ({ id }) => id !== action.payload
      );
    },
    setShippingAddress(state, action: PayloadAction<IShippingAddress>) {
      state.shippingAddress = action.payload;
    },
    clearShippingAddress(state) {
      state.shippingAddress = {};
    },
    setPaymentMethod(state, action: PayloadAction<MethodPaymentType>) {
      state.paymentMethod = action.payload;
    },
  },
});

export const actionCreatorAddItem = (newItem: IShortenedProduct) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(cartSlice.actions.addNewItem(newItem));
    const updatedCartItems = getState().cart.cartItems;
    localStorage.setItem("cart-items", JSON.stringify(updatedCartItems));
  };
};

export const actionCreatorRemoveItem = (itemId: string) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(cartSlice.actions.removeItem(itemId));
    const updatedCartItems = getState().cart.cartItems;
    localStorage.setItem("cart-items", JSON.stringify(updatedCartItems));
  };
};

export const actionCreatorAddShippingAddress = (
  shippingAddres: IShippingAddress
) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(cartSlice.actions.setShippingAddress(shippingAddres));
    localStorage.setItem("shipping-address", JSON.stringify(shippingAddres));
  };
};

export const actionCreatorEmptyOutCart = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(cartSlice.actions.emptyOutCart());
    localStorage.removeItem("cart-items");
  };
};

export const cartReducer = cartSlice.reducer;
export const cartActions = cartSlice.actions;
