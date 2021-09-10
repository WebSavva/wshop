import { useReducer, useCallback } from "react";
import { IRequestInfo } from "../types/Request";
import {
  IHttpState,
  actionType,
  fetchCb,
  fetchFunc,
} from "./../types/useHttpTypes";



function useHttp<FetchedTypeData>() {
  const [httpState, dispatch] = useReducer(function reducer(
    state: IHttpState<FetchedTypeData>,
    action: actionType<FetchedTypeData>
  ): IHttpState<FetchedTypeData> {
    switch (action.type) {
      case "FETCHING":
        return {
          ...state,
          error:null,
          isFetching: true,
        };
        break;
      case "SUCCESS":
        return {
          ...state,
          isFetching: false,
          fetchedData: action.payload.data,
        };
      case "ERROR":
        return {
          ...state,
          isFetching: false,
          error: action.payload.errorMessage,
        };
        break;
      default:
        return {
          ...state,
        };
    }
  }, {
    isFetching: false,
    error: null,
    fetchedData: null,
  } as IHttpState<FetchedTypeData>);

  const sendRequest: fetchFunc<FetchedTypeData> = useCallback(
    async (requestInfo: IRequestInfo, cb?: fetchCb<FetchedTypeData>) => {
      try {
        dispatch({
          type: "FETCHING",
        });

        const response = await fetch(
          `${window.location.origin}/${requestInfo.url}`,
          requestInfo.config
        );

        const fetchedData = (await response.json()) as
          | FetchedTypeData
          | { message: string };

        if (!response.ok) {
          const reason =
            "message" in fetchedData
              ? fetchedData.message
              : "Something went wrong";
          throw new Error(reason);
        }

        dispatch({
          type: "SUCCESS",
          payload: {
            data: fetchedData as FetchedTypeData,
          },
        });
        cb && cb(fetchedData as FetchedTypeData);
      } catch (error) {
        dispatch({
          type: "ERROR",
          payload: {
            errorMessage: (error as Error).message,
          },
        });
      }
    },
    []
  );

  return {
    ...httpState,
    sendRequest,
  };
}

export default useHttp;
