import httpSliceGenerator from "./http-generator";
import { IProductState } from "../types/ReduxStates";
import { IProduct } from "../types/ProductInterface";

const productSlice = httpSliceGenerator<IProductState, IProduct>({
  sliceName: "product",
  sliceInitialState: {
    data: null,
    isFetching: false,
    error: null,
  },
});

export const productReducer = productSlice.slice.reducer;
export const productTriggerRequest = productSlice.actionCreator;
