import { IRequestInfo } from "../types/Request";
import {
  IPartialRequestState,
  httpReducer,
  onFetchedHandler,
} from "../types/ReduxStates";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";

export default function httpSliceGenerator<
  T extends IPartialRequestState,
  FetchedDataType
>({
  sliceName,
  sliceInitialState,
  additionalReducers,
  fetchHandler,
}: {
  sliceInitialState: T;
  sliceName: string;
  additionalReducers?: {
    [name: string]: httpReducer<T, any>;
  };
  fetchHandler?: onFetchedHandler;
}) {
  const httpSlice = createSlice({
    name: sliceName,
    initialState: sliceInitialState,
    reducers: {
      logOut: () => {},
      ...additionalReducers,
      startFetching(state) {
        state.error = null;
        state.isFetching = true;
      },
      succesfullFetch(state, action: PayloadAction<FetchedDataType>) {
        state.data = action.payload;
        state.error = null;
        state.isFetching = false;
      },
      failedFetch(state, action: PayloadAction<string>) {
        state.isFetching = false;
        state.error = action.payload;
      },
    },
  });

  const httActions = httpSlice.actions;
  const createSendRequestAction = (
    requestInfo: IRequestInfo,
    additionalArgs?: {
      [name: string]: any;
    }
  ) => {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(httActions.startFetching());
        const response = await fetch(requestInfo.url, requestInfo.config);

        const fetchedData = await response.json();

        if (!response.ok) {
          throw new Error(fetchedData.message);
        }

        dispatch(httActions.succesfullFetch(fetchedData));

        if (fetchHandler) {
          fetchHandler(fetchedData, additionalArgs);
        }
      } catch (error) {
        dispatch(httActions.failedFetch((error as Error).message));
      }
    };
  };
  return {
    slice: httpSlice,
    actionCreator: createSendRequestAction,
  };
}
