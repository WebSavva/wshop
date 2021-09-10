import { productReducer } from "./product_slice";
import { productsReducer } from "./products_slice";
import { cartReducer } from "./cart_slice";
import { authReducer } from "./auth_slice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    product: productReducer,
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
