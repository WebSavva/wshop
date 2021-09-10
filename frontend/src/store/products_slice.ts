import httpSliceGenerator from "./http-generator";
import { IProductsState } from "../types/ReduxStates";
import { IProductResponse } from "../types/ProductInterface";

const productsSlice = httpSliceGenerator<IProductsState, IProductResponse>({
  sliceName: "products",
  sliceInitialState: {
    data: {
      currentPageNumber: 1,
      pagesNumber: null,
      productsData: [],
    },
    isFetching: false,
    error: null,
  },
});

export const productsReducer = productsSlice.slice.reducer;
export const productsTriggerRequest = productsSlice.actionCreator;
